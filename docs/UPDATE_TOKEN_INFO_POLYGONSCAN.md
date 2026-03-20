# Update Token Info trên PolygonScan

## Mục đích
Cập nhật Token Name, Symbol và thông tin hiển thị trên PolygonScan sau khi upgrade contract.

---

## Thông tin contract

| Key | Value |
|-----|-------|
| Proxy Address | `0x72136C4021551b80b5a68F246fe11dBbe8dCBb29` |
| Implementation | `0x6c6F619a75ceDF1477F0C14375d0d60aDa1E2a57` |
| Owner | `0xa826774CA92237635421FeBe045CA2f3D1D4dbf0` |
| Network | Polygon Mainnet |

---

## Step 1: Verify Address Ownership

> Link Token Update Form: https://polygonscan.com/tokenupdate
> Link Verify Ownership: https://polygonscan.com/verifiedSignatures

1. Truy cập: https://polygonscan.com/tokenupdate
2. Điền contract address: `0x72136C4021551b80b5a68F246fe11dBbe8dCBb29` → Click **Next**
3. Nếu chưa verify ownership, click link **"tool"** trong thông báo vàng → redirect tới: https://polygonscan.com/verifySignature
3. Điền form:

| Field | Value |
|-------|-------|
| Contract Owner/Creator Address | `0xa826774CA92237635421FeBe045CA2f3D1D4dbf0` |
| Message | Copy nguyên message mà PolygonScan generate cho bạn |

4. Lấy Signature Hash bằng cách chạy script:

```bash
npx hardhat console --network polygon --no-compile
```

Trong console chạy:
```javascript
const [deployer] = await ethers.getSigners();
const message = `PASTE_MESSAGE_TỪ_POLYGONSCAN_VÀO_ĐÂY`;
const signature = await deployer.signMessage(message);
console.log("Signature:", signature);
```

5. Copy signature (bao gồm `0x` ở đầu) paste vào ô **Signature Hash**
6. Click **"Verify Ownership"**

---

## Step 2: Token Update Application Form

1. Truy cập: https://polygonscan.com/tokenupdate
2. Điền **contract address**: `0x72136C4021551b80b5a68F246fe11dBbe8dCBb29`
3. Click **Next**

### Section 1: Request Type

| Field | Value |
|-------|-------|
| Choose one | `New/First Time Token Update` |
| Comment/Message | `Update token name and symbol after contract upgrade` |

### Section 2: Basic Information

| Field | Value |
|-------|-------|
| Token Contract Address | `0x72136C4021551b80b5a68F246fe11dBbe8dCBb29` |
| Requester Name | `Vincent Vo` |
| Requester Email Address | `vincentdev924@gmail.com` |
| Project Name | `MCC` |
| Official Project Website | `https://github.com/lehongvo/TestProxy` |
| Official Project Email Address | `vincentdev924@gmail.com` |
| Link to download a 32x32 svg icon logo | *(link tới file SVG 32x32 - xem Step 2.1 bên dưới)* |
| Project Sector | `NFT` |
| Project Description | `MCC721A_new is an upgradeable ERC721A NFT collection on Polygon network with attribute management and token locking capabilities.` |

### Section 3: Social Profiles (optional - để trống được)

### Section 4: Price Data (optional - để trống được)

### Section 5: Others (optional - để trống được)

4. Click **Submit**

---

## Step 2.1: Tạo SVG Logo (nếu chưa có)

PolygonScan yêu cầu link download file SVG 32x32. Cách đơn giản:

1. Tạo file `logo.svg` trong repo:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7B3FE4"/>
  <text x="16" y="21" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">MCC</text>
</svg>
```

2. Commit và push lên GitHub
3. Lấy raw link: `https://raw.githubusercontent.com/lehongvo/TestProxy/main/logo.svg`
4. Paste link vào form

---

## Step 3: Verify Proxy Contract (nếu chưa verify)

1. Truy cập: https://polygonscan.com/proxyContractChecker?a=0x72136C4021551b80b5a68F246fe11dBbe8dCBb29
2. Click **"Verify"**
3. PolygonScan sẽ detect TransparentUpgradeableProxy và link tới implementation
4. Sau khi verify, trang contract sẽ hiện:
   - Tab **"Read as Proxy"** / **"Write as Proxy"**
   - Badge **"Source Code (Proxy)"**

---

## Step 4: Kiểm tra kết quả

1. Truy cập: https://polygonscan.com/token/0x72136C4021551b80b5a68F246fe11dBbe8dCBb29
2. Kiểm tra TOKEN TRACKER hiển thị `MCC721A_new (MCC721A_new)`
3. Click tab **"Read as Proxy"** → gọi `name()` và `symbol()` để verify onchain

> **Lưu ý:** PolygonScan review form thủ công, có thể mất 1-3 ngày làm việc để cập nhật Token Tracker.

---

## Lệnh hữu ích

```bash
# Kiểm tra name/symbol onchain
npx hardhat console --network polygon --no-compile
> const c = await ethers.getContractAt("NEW_MCC721A", "0x72136C4021551b80b5a68F246fe11dBbe8dCBb29")
> await c.name()    // "MCC721A_new"
> await c.symbol()  // "MCC721A_new"

# Update name/symbol (sửa .env trước)
npx hardhat run scripts/callUpdateNameAndSymbol.js --network polygon

# Mint NFT
npx hardhat run scripts/mintNFT.js --network polygon

# Verify implementation contract
npx hardhat verify --network polygon --contract "contracts/NEW_MCC721A.sol:NEW_MCC721A" 0x6c6F619a75ceDF1477F0C14375d0d60aDa1E2a57
```
