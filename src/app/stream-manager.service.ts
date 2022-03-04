import {Injectable} from '@angular/core';
import {Connection, PublicKey, Transaction} from "@solana/web3.js";
import Stream, {
  BN,
  CancelStreamParams,
  Cluster,
  CreateStreamParams,
  GetStreamsParams,
  StreamDirection
} from "@streamflow/stream";
import {Stream as StreamData} from "@streamflow/stream/dist/types";
import Wallet from "@project-serum/sol-wallet-adapter";
import { Wallet as WalletType} from "@project-serum/anchor/src/provider";

@Injectable({
  providedIn: 'root'
})
export class StreamManagerService {
  private static cluster = Cluster.Devnet
  private static providerUrl = 'https://phantom.app/';
  private static wallet = new Wallet(StreamManagerService.providerUrl, getUrl())
  private static connectedWallet: ConnectedWallet | undefined
  constructor() {}

  static connectWallet() {
    this.wallet.on('connect', publicKey => {
      console.log('Connected to ' + publicKey.toBase58())
      this.connectedWallet = new ConnectedWallet(this.wallet)
    });
    this.wallet.on('disconnect', () => {
      console.log('Disconnected')
      this.connectedWallet = undefined;
    });
    this.wallet.connect();
  }

  private static totalAmount(info: Information): number {
    return info.adults   * info.pricePerAdult   +
      info.students * info.pricePerStudent +
      info.children * info.pricePerChild;
  }

  private static getPeriod(info: Information) {
    return info.priceUnit === 'MINUTE' ? 60 : 60 * 60;
  }

  static async create(info: Information) {
    const params: CreateStreamParams = {
      sender: this.connectedWallet!,
      recipient: info.receiver,
      period: StreamManagerService.getPeriod(info),
      amountPerPeriod: new BN(StreamManagerService.totalAmount(info)),
      cancelableBySender: true,
      cancelableByRecipient: false,
      canTopup: false,
      cliff: 0,
      cliffAmount: new BN(0),
      connection: await connect(),
      depositedAmount: new BN(0),
      mint: "",
      name: "",
      start: 0,
      transferableByRecipient: false,
      transferableBySender: false,
    };
    try {
      const {tx, id} = await Stream.create(params);
    } catch (exception) {
      console.log(exception);
    }
  }

  // the string in response is probably id TODO NOTE
  static async getActiveStream(receiver: PublicKey): Promise<{id: string, data: StreamData} | undefined> {
    const params: GetStreamsParams = {
      wallet: this.connectedWallet!.publicKey,
      direction: StreamDirection.Outgoing,
      cluster: this.cluster,
      connection: await connect()
    }
    const streams: [string, StreamData][] = await Stream.get(params)
    const stream = streams.find(it => {
      receiver.equals(new PublicKey(it[1].recipient))
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

function getUrl(devnet: boolean = true) {
  return devnet
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';
}

export default async function connect(): Promise<Connection> {
  const url = getUrl()
  return new Connection(url, 'confirmed')
}

export class ConnectedWallet implements WalletType {

  publicKey: PublicKey;

  constructor(private wallet: Wallet) {
    if (!wallet.connected) {
      throw Error('Wallet is not connected!!!')
    }
    this.publicKey = wallet.publicKey!
  }

  signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return this.wallet.signAllTransactions(txs);
  }

  signTransaction(tx: Transaction): Promise<Transaction> {
    return this.wallet.signTransaction(tx);
  }

}
