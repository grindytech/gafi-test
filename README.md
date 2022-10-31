# gafi-test: Testing Gafi Performance APIs

## Preparation
1. Clone Project
```
  $ git clone https://github.com/grindytech/gafi-test.git
  $ cd gafi-test/
```

2. Create .env environment
```
$ nano .env

# Copy these variables
WALLETS_PATH="resources/wallets.txt"
NEW_WALLETS_PATH="resources/wallets.txt"
RPC="https://rpc-testnet.gafi.network"
WSS="wss://ws-testnet-sig.gafi.network"
```

2. Build & Run
```
  $ npm i
  $ npm run start
```

## Testing Steps:

1. Create accounts
```
url: /wallet/create

example: http://127.0.0.1:5000/wallet/create?count=1000

method: GET

successResponse: "wallets created"
```

| RequestField  | Type | Description |
| ------------- | ------------- | ------------- |
| count | number  |  number of testing wallet |


2. Funded accounts
```
url: /wallet/funded

example: http://127.0.0.1:5000/wallet/funded

method: GET

successResponse: "Funded wallets"
```

3. Mapping accounts
```
url: /wallet/map

example: http://127.0.0.1:5000/wallet/map

method: GET

successResponse: "proof address mapping"
```

4. Create ERC20 Token
```
url: /tx/create_token

example: http://127.0.0.1:5000/tx/create_token?count=1000

method: GET

successResponse: "created tokens"
```

| RequestField  | Type | Description |
| ------------- | ------------- | ------------- |
| count | number  |  number of testing wallet deploying |


5. Get TPS (Transaction Per Second)
```
url: /tx/tps

example: localhost:5000/tx/tps?count=100

method: GET

successResponse:
{
    "TPS": 48.75
}

```
| RequestField  | Type | Description |
| ------------- | ------------- | ------------- |
| count | number  |  number of block |
