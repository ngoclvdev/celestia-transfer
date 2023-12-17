import {getWalletItems, printBalances, untilPositiveBalance} from "./utils/cosmos-common.js"
import {sendConsolidatedTransactions} from "./utils/cosmos-tx.js"
import {readFile, sleep, until5SecLeft} from "./utils/other.js"

import {WalletItem} from "./datatypes/cosmos.js"
import {GENESIS_TIMESTAMP, RPC_ENDPOINT} from "./config.js"


async function main() {
    let fileStrings: string[] = readFile("../.././data/mnemonic.txt")
    await until5SecLeft(GENESIS_TIMESTAMP)

    let walletItems: WalletItem[] = await getWalletItems(fileStrings, RPC_ENDPOINT)

    console.log('\n/////// BALANCE ///////\n')
    await untilPositiveBalance(walletItems)

    console.log('\n/////// TRANSFER ///////\n')
    await sendConsolidatedTransactions(walletItems)

    // Mint times
    const numberOfTimes = 1_000
    let successCount = 0;
    let attemptCount = 0;

    while (successCount < numberOfTimes) {
        try {
            await sendConsolidatedTranSsactions(walletItems)
            successCount++;
            console.log(`MINT ${attemptCount + 1} SUCCESS: `);
            // Delay 1s
            await new Promise(resolve => setTimeout(resolve, 1_000));
        } catch (error) {
            console.error(`MINT ${attemptCount + 1} ERROR: `, error);
            // Delay 1s
            await new Promise(resolve => setTimeout(resolve, 1_000));
        }
        attemptCount++;
    }

    console.log(`MINT TIMES: ${attemptCount}, SUCCESS TIMES: ${successCount}`);

    console.log('\n/////// BALANCE ///////\n')
    await printBalances(walletItems, true, true)
    await sleep(1_000, false)
    console.log('\nwith love by @cyberomanov.\n')
}

await main()