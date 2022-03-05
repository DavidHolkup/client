#1
install

- @solana/spl-token
- @solana/wallet-adapter-wallets
- buffer-layout
  add to polyfills.ts
```
(window as any)['global'] = window;
(window as any)['process'] = {
  env: {DEBUG: 'debugging', NODE_DEBUG: 'debugging'},
};
```

#2
`Stream` from `@streamflow/stream/dist/types`
should have `isActive` field or method.

Now I try to get this information by calling
```
stream.canceledAt == undefined
```
but I'm not sure it's correct.

#3
It would be nice to describe what each function returns semantically.

For example
```
// in Stream from @streamflow/stream
static get({ connection, wallet, type, direction, cluster, }: GetStreamsParams): Promise<[string, StreamData][]>;
```
I assume it returns [`stream id`, `stream itself`] but I can only guess and I can't know for sure until I inspect the response.
This assuming / guessing happens a lot while reading the docs.
#4
When creating stream. I want to start paying immediately.

I'm not sure how to achieve this. There are two parameters that I think are related - `start` and `cliff`.
I don't understand how these parameters differ and how should I use them together.

To start _now_ I guess I have to use something like this
```
start: Date.now() / 1000,
cliff: 0,
```
I can't imagine a usecase where it is desirable to open stream in the past.
Therefore, I would suggest to make `start` parameter relative to _now_
```
start: 0,       // starts now
start: 60,      // starts 60 seconds from now
start: 3600,    // starts 1 hour from now
```

#5
I have no idea what `topup` means

#6
I have not found anything regarding stable-coin usage in the docs.

Is it the mint parameter which decides what token to use?

#7
I am confused by `withdraw from stream`.
Do I have to call it to initiate a payment?
I think not, I think `create stream` kicks this off and than it happens automatically.
It probably also does not mean that I don't want to be part of the stream anymore.
For this I would use `cancel stream`.
