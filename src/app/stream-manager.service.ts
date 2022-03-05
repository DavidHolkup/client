import {Injectable} from '@angular/core';
import {clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction} from "@solana/web3.js";
import Stream, {
  BN,
  CancelStreamParams,
  Cluster,
  CreateStreamParams, getBN,
  GetStreamsParams,
  StreamDirection,
} from "@streamflow/stream";
import {Stream as StreamData} from "@streamflow/stream/dist/types";
import { Wallet as WalletType} from "@project-serum/anchor/src/provider";

@Injectable({
  providedIn: 'root'
})
export class StreamManagerService {
  private static cluster = Cluster.Devnet
  private static connectedWallet: ConnectedWallet | undefined
  constructor() {}

  static async connectWallet() {
    return this.connectedWallet = new ConnectedWallet()
  }

  static async airdrop() {
    return this.connectedWallet?.airdrop()
  }

  private static totalAmount(info: Information): number {
    return info.adults * info.pricePerAdult   +
      info.students * info.pricePerStudent +
      info.children * info.pricePerChild;
  }

  private static getPeriod(info: Information) {
    return info.priceUnit === 'MINUTE' ? 60 : 60 * 60;
  }

  static async create(info: Information) {
    const amountPerMinute = StreamManagerService.totalAmount(info)
    const params: CreateStreamParams = {
      sender: this.connectedWallet!,
      recipient: info.receiver,
      period: StreamManagerService.getPeriod(info),
      amountPerPeriod: getBN(amountPerMinute, 9),
      start: Math.round(Date.now() / 1000),
      name: info.receiverName + Date.now(),
      depositedAmount: getBN(amountPerMinute * 120, 9),
      cancelableBySender: true,
      cancelableByRecipient: false,
      canTopup: false,
      cliff: 0,
      cliffAmount: getBN(0, 9),
      connection: await connect(),
      mint: "DNw99999M7e24g99999999WJirKeZ5fQc6KY999999gK",
      transferableByRecipient: false,
      transferableBySender: false,
    };
    console.log(new PublicKey(info.receiver))
    console.log('creating channel with these parameters', params)
    const {tx, id} = await Stream.create(params);
    console.log("Stream created with id", id)
  }

  static async getActiveStream(receiver: string): Promise<{id: string, data: StreamData} | undefined> {
    const params: GetStreamsParams = {
      wallet: this.connectedWallet!.publicKey,
      direction: StreamDirection.Outgoing,
      cluster: this.cluster,
      connection: await connect()
    }
    const streams: [string, StreamData][] = await Stream.get(params)
    const stream = streams.find(it => {
      const str: StreamData = it[1]
      return receiver === str.recipient && str.canceledAt == undefined;
    })
    if (stream == undefined) {
      return undefined
    } else {
      return {
        id: stream[0],
        data: stream[1],
      }
    }
  }

  static async cancelStream(id: string) {
    const params: CancelStreamParams = {
      connection: await connect(),
      invoker: this.connectedWallet!,
      id: id,
      cluster: this.cluster,
    }
    try {
      const { tx } = await Stream.cancel(params);
      console.log("Stream closed")
    } catch (exception) {
      console.log(exception);
    }
  }
}

export interface Information {
  adults: number;
  students: number;
  children: number;
  pricePerAdult: number;
  pricePerStudent: number;
  pricePerChild: number;
  priceUnit: 'MINUTE' | 'HOUR';
  receiver: string;
  receiverName: string;
}

export default function connect(): Connection {
  return new Connection(clusterApiUrl('devnet'), 'confirmed')
}

export class ConnectedWallet implements WalletType {

  publicKey: PublicKey;
  private readonly keyPair: Keypair;

  constructor() {
    this.keyPair = Keypair.generate()
    this.publicKey = this.keyPair.publicKey!
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    for (const it of txs) {
      await this.signTransaction(it)
    }
    return txs
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    await tx.sign(this.keyPair)
    return tx
  }

  async airdrop() {
    let connection = await connect();
    let airdropSignature = await connection.requestAirdrop(
      this.publicKey,
      LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);
  }
}
