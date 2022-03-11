import {Injectable} from '@angular/core';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import Stream, {
  CancelStreamParams,
  Cluster,
  CreateStreamParams,
  getBN,
  GetStreamsParams,
  StreamDirection,
} from '@streamflow/stream';
import {Stream as StreamData} from '@streamflow/stream/dist/types';
import {Wallet as WalletType} from '@project-serum/anchor/src/provider';
import {AccountLayout, TOKEN_PROGRAM_ID} from "@solana/spl-token";

@Injectable({
  providedIn: 'root',
})
export class StreamManagerService {
  private static cluster = Cluster.Devnet;
  private static wallet: PhantomWallet;

  constructor() {
  }

  static async connectWallet() {
    if (StreamManagerService.phantomIsInstalled()) {
      console.log("Phantom is installed")
      try {
        const resp = await window['solana'].connect();
        console.log(resp)
        this.wallet = new PhantomWallet(resp.publicKey)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Phantom is not installed, redirecting")
      window.open("https://phantom.app/", "_blank");
    }
  }

  private static phantomIsInstalled() {
    return window['solana'] && window['solana'].isPhantom
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
      sender: this.wallet,
      recipient: info.receiver,
      period: 60,
      amountPerPeriod: getBN(1, 9),
      start: now,
      name: info.receiverName + now,
      depositedAmount: getBN(10, 9),
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
    const {tx, id} = await Stream.create(params);
    console.log('Stream created with id', id);
  }

  static async getActiveStream(
    receiver: string
  ): Promise<{ id: string; data: StreamData } | undefined> {
    const params: GetStreamsParams = {
      wallet: this.wallet!.publicKey,
      direction: StreamDirection.Outgoing,
      cluster: this.cluster,
      connection: await connect(),
    };
    const streams: [string, StreamData][] = await Stream.get(params);
    console.log(streams)
    const stream = streams.find((it) => {
      const str: StreamData = it[1];
      console.log(receiver === str.recipient, str.canceledAt == 0, str.end < Date.now())
      return receiver === str.recipient && str.canceledAt == 0 && str.end < Date.now();
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
      invoker: this.wallet!,
      id: id,
      cluster: this.cluster,
    };
      console.log("canceling stream with params", params)
      const {tx} = await Stream.cancel(params);
      console.log('Stream closed');
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

export class PhantomWallet implements WalletType {

  constructor(public publicKey: PublicKey) {
    this.printTokens()
  }

  signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return window['solana'].signAllTransactions(txs);
  }

  signTransaction(tx: Transaction): Promise<Transaction> {
    return window['solana'].signTransaction(tx);
  }

  async printTokens() {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      const tokenAccounts = await connection.getTokenAccountsByOwner(
        this.publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      console.log("Token                                         Balance");
      console.log("------------------------------------------------------------");
      tokenAccounts.value.forEach((e) => {
        const accountInfo = AccountLayout.decode(e.account.data);
        console.log(`${new PublicKey(accountInfo.mint)}   ${accountInfo.amount}`);
      })
  }
}
