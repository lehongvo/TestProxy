# Update Token Info on Block Explorer

## Purpose
Update Token Name, Symbol and display info on PolygonScan / Etherscan after contract upgrade.

---

## Contract Info

### Network 1: Polygon Mainnet

| Key | Value |
|-----|-------|
| Proxy Address | `0x9972c16Cd174a429958013812295936A9071Dda9` |
| Implementation | `0x59447abcb418369c6a12e3486e7e50fd06438afb` |
| Owner | `0x2d56E34350757Fa90352025957e82aa72c30BfC4` |
| Explorer | https://polygonscan.com |
| Token Update | https://polygonscan.com/tokenupdate |
| Verify Ownership | https://polygonscan.com/verifiedSignatures |
| Proxy Checker | https://polygonscan.com/proxyContractChecker?a=0x9972c16Cd174a429958013812295936A9071Dda9 |

### Network 2: Ethereum Mainnet

| Key | Value |
|-----|-------|
| Proxy Address | `0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61` |
| Implementation | `0xF92254a358938dc1923768a09D73489ddacC6A8F` |
| Owner | `0x2d56E34350757Fa90352025957e82aa72c30BfC4` |
| Explorer | https://etherscan.io |
| Token Update | https://etherscan.io/tokenupdate |
| Verify Ownership | https://etherscan.io/verifiedSignatures |
| Proxy Checker | https://etherscan.io/proxyContractChecker?a=0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61 |

---

## Step 1: Verify Address Ownership

> Do this ONCE per network. Same owner `0x2d56E34350757Fa90352025957e82aa72c30BfC4` for both networks.

### For Polygon:

1. Go to: https://polygonscan.com/tokenupdate
2. Enter contract address: `0x9972c16Cd174a429958013812295936A9071Dda9` → Click **Next**
3. If not yet verified ownership, click **"tool"** link in yellow banner → redirect to: https://polygonscan.com/verifySignature
4. Fill form:

| Field | Value |
|-------|-------|
| Contract Owner/Creator Address | `0x2d56E34350757Fa90352025957e82aa72c30BfC4` |
| Message | Copy the message that PolygonScan generates |

5. Get Signature Hash via **MetaMask**:
   - Open MetaMask, make sure you are using wallet `0x2d56E34350757Fa90352025957e82aa72c30BfC4`
   - Open browser console (F12 → Console)
   - Paste and run:

```javascript
const message = `PASTE_MESSAGE_FROM_POLYGONSCAN_HERE`;
// Example: "[polygonscan.com 20/03/2026 08:41:27] I, hereby verify that I am the owner/creator of the address [0x9972c16Cd174a429958013812295936A9071Dda9]"
const account = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
const signature = await ethereum.request({
  method: 'personal_sign',
  params: [message, account]
});
console.log("Signature:", signature);
```

   - MetaMask will popup → Click **Sign**
   - Copy signature from console

6. Paste signature (including `0x` prefix) into **Signature Hash** field
7. Click **"Verify Ownership"**

### For Ethereum:

1. Go to: https://etherscan.io/tokenupdate
2. Enter contract address: `0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61` → Click **Next**
3. If not yet verified ownership, click **"tool"** link → redirect to: https://etherscan.io/verifySignature
4. Same steps as Polygon above (fill form → sign with MetaMask → paste signature)

---

## Step 2: Token Update Application Form

> Repeat for each network.

### For Polygon:

1. Go to: https://polygonscan.com/tokenupdate
2. Enter: `0x9972c16Cd174a429958013812295936A9071Dda9` → Click **Next**

### For Ethereum:

1. Go to: https://etherscan.io/tokenupdate
2. Enter: `0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61` → Click **Next**

### Fill the form (same for both):

#### Section 1: Request Type

| Field | Value |
|-------|-------|
| Choose one | `Existing Token Info Update` |
| Comment/Message | `Please clear the cached token info and update to the latest token name and symbol from the contract.` |

#### Section 2: Basic Information

| Field | Value |
|-------|-------|
| Token Contract Address | *(auto-filled)* |
| Requester Name | `Vincent Vo` |
| Requester Email Address | `vincentdev924@gmail.com` |
| Project Name | `MCC` |
| Official Project Website | `https://github.com/lehongvo/TestProxy` |
| Official Project Email Address | `vincentdev924@gmail.com` |
| Link to download a 32x32 svg icon logo | `https://raw.githubusercontent.com/lehongvo/TestProxy/main/logo.svg` |
| Project Sector | `NFT` |
| Project Description | `MCC is an upgradeable ERC721A NFT collection on Polygon with attribute management and token locking capabilities.` |

#### Section 3: Social Profiles (optional - skip)

#### Section 4: Price Data (optional - skip)

#### Section 5: Others (optional - skip)

3. Click **Submit**

---

## Step 2.1: Create SVG Logo (if needed)

Both PolygonScan and Etherscan require a link to download a 32x32 SVG icon.

1. Create file `logo.svg` in repo:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7B3FE4"/>
  <text x="16" y="21" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">MCC</text>
</svg>
```

2. Commit and push to GitHub
3. Get raw link: `https://raw.githubusercontent.com/lehongvo/TestProxy/main/logo.svg`
4. Paste link into form

---

## Step 3: Verify Proxy Contract

> Do this for both networks so the explorer shows "Read as Proxy" / "Write as Proxy" tabs.

### Polygon:
1. Go to: https://polygonscan.com/proxyContractChecker?a=0x9972c16Cd174a429958013812295936A9071Dda9
2. Click **"Verify"**

### Ethereum:
1. Go to: https://etherscan.io/proxyContractChecker?a=0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61
2. Click **"Verify"**

After verify:
- Tab **"Read as Proxy"** / **"Write as Proxy"** will appear
- Badge **"Source Code (Proxy)"** will show

---

## Step 4: Verify Results

### Polygon:
- Token page: https://polygonscan.com/token/0x9972c16Cd174a429958013812295936A9071Dda9
- Contract: https://polygonscan.com/address/0x9972c16Cd174a429958013812295936A9071Dda9
- Implementation: https://polygonscan.com/address/0x59447abcb418369c6a12e3486e7e50fd06438afb#code

### Ethereum:
- Token page: https://etherscan.io/token/0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61
- Contract: https://etherscan.io/address/0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61
- Implementation: https://etherscan.io/address/0xF92254a358938dc1923768a09D73489ddacC6A8F#code

> **Note:** Explorer reviews form manually. It may take 1-3 business days to update Token Tracker display.

---

## Useful Commands

```bash
# Check name/symbol onchain (Polygon)
npx hardhat console --network polygon --no-compile
> const c = await ethers.getContractAt("NEW_MCC721A", "0x9972c16Cd174a429958013812295936A9071Dda9")
> await c.name()
> await c.symbol()

# Check name/symbol onchain (Ethereum)
npx hardhat console --network ethereum --no-compile
> const c = await ethers.getContractAt("NEW_MCC721A", "0x3b0E6163ac2b7fa936b5fd6f4Bf7D4247157dE61")
> await c.name()
> await c.symbol()

# Verify implementation contract (Polygon)
npx hardhat verify --network polygon --contract "contracts/NEW_MCC721A.sol:NEW_MCC721A" 0x59447abcb418369c6a12e3486e7e50fd06438afb

# Verify implementation contract (Ethereum)
npx hardhat verify --network mainnet --contract "contracts/NEW_MCC721A.sol:NEW_MCC721A" 0xF92254a358938dc1923768a09D73489ddacC6A8F
```
