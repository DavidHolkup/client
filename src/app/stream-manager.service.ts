import { Injectable } from '@angular/core';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import Stream, {
  BN,
  CancelStreamParams,
  Cluster,
  CreateStreamParams,
  getBN,
  GetStreamsParams,
  StreamDirection,
} from '@streamflow/stream';
import { Stream as StreamData } from '@streamflow/stream/dist/types';
import { Wallet as WalletType } from '@project-serum/anchor/src/provider';

@Injectable({
  providedIn: 'root',
})
export class StreamManagerService {
  private static cluster = Cluster.Devnet;
  private static connectedWallet: ConnectedWallet | undefined;
  constructor() {}

  static async connectWallet() {
    return (this.connectedWallet = new ConnectedWallet(undefined));
  }

  static async airdrop() {
    return this.connectedWallet?.airdrop();
  }

  private static totalAmount(info: Information): number {
    return (
      info.adults * info.pricePerAdult +
      info.students * info.pricePerStudent +
      info.children * info.pricePerChild
    );
  }

  private static getPeriod(info: Information) {
    return info.priceUnit === 'MINUTE' ? 60 : 60 * 60;
  }

  static async create(info: Information) {
    const amountPerMinute = StreamManagerService.totalAmount(info);
    const now = Math.round(Date.now() / 1000) + 10;
    const params: CreateStreamParams = {
      sender: this.getWalletFromStorage(),
      recipient: info.receiver,
      period: 60,
      amountPerPeriod: getBN(100, 9),
      start: now,
      name: info.receiverName + now,
      depositedAmount: getBN(500, 9),
      cancelableBySender: true,
      cancelableByRecipient: false,
      canTopup: false,
      cliff: now,
      cliffAmount: getBN(0, 9),
      connection: new Connection(clusterApiUrl('devnet'), 'confirmed'),
      mint: 'Gssm3vfi8s65R31SBdmQRq6cKeYojGgup7whkw4VCiQj',
      transferableByRecipient: false,
      transferableBySender: false,
    };
    console.log(new PublicKey(info.receiver));
    console.log('creating channel with these parameters', params);
    const { tx, id } = await Stream.create(params);
    console.log('Stream created with id', id);
  }

  static async getActiveStream(
    receiver: string
  ): Promise<{ id: string; data: StreamData } | undefined> {
    const params: GetStreamsParams = {
      wallet: this.connectedWallet!.publicKey,
      direction: StreamDirection.Outgoing,
      cluster: this.cluster,
      connection: await connect(),
    };
    const streams: [string, StreamData][] = await Stream.get(params);
    const stream = streams.find((it) => {
      const str: StreamData = it[1];
      return receiver === str.recipient && str.canceledAt == undefined;
    });
    if (stream == undefined) {
      return undefined;
    } else {
      return {
        id: stream[0],
        data: stream[1],
      };
    }
  }

  static async cancelStream(id: string) {
    const params: CancelStreamParams = {
      connection: await connect(),
      invoker: this.connectedWallet!,
      id: id,
      cluster: this.cluster,
    };
    try {
      const { tx } = await Stream.cancel(params);
      console.log('Stream closed');
    } catch (exception) {
      console.log(exception);
    }
  }

  static getWalletFromStorage() {
    const keypair = localStorage.getItem('wallet')
    this.connectedWallet = new ConnectedWallet(JSON.parse(keypair!))
    return this.connectedWallet
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
  return new Connection(clusterApiUrl('devnet'), 'confirmed');
}

export class ConnectedWallet implements WalletType {
  publicKey: PublicKey;
  private readonly keyPair: Keypair;

  constructor(keypair: any) {
    if (keypair == undefined) {
      this.keyPair = Keypair.generate();
      localStorage.setItem('wallet', JSON.stringify(this.keyPair))
      this.publicKey = this.keyPair.publicKey!;
      console.log(this.publicKey.toBase58())
    } else {
      const key = new Uint8Array(64)
      for (let i = 0; i < 64; i++) {
        key[i] = keypair['_keypair']['secretKey'][`${i}`]
      }
      this.keyPair = Keypair.fromSecretKey(key)
      this.publicKey = this.keyPair.publicKey!;
      console.log(this.publicKey.toBase58())
    }
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    for (const it of txs) {
      await this.signTransaction(it);
    }
    return txs;
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    await tx.sign(this.keyPair);
    return tx;
  }

  async airdrop() {
    let connection = await connect();
    let airdropSignature = await connection.requestAirdrop(
      this.publicKey,
      LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(airdropSignature);
  }
}
