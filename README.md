# CHANCOIN: Tipping Extension
A ChanCoin Chrome browser extension for 4chan
## General Information
This extension adds a tip button to 4chan posts with the following name format: `$4CHN:address`

If you want to receive tips through this extension, you MUST set your name on 4chan to this format. For example: `$4CHN:CbkMmgphehVHQo27tWEzNzLCbEKkwaBwwL`

Once installed, correctly-formatted 4chan posts will have an additional "Tip poster" button in their dropdown box.

![Tip button](http://i.imgur.com/IekqP7H.png)

This extension is also compatible with the 4ChanX extension

![Tip button](http://i.imgur.com/M5K1PK0.png)

Clicking on this button will open a prompt that allows you to specify how much you would like to send.

## Installation

### Step 1
The first step is to run the ChanCoin wallet in server mode. This allows the extension to connect to it.

To do this, we'll create a configuration file in the wallet's data folder. This folder is located at `%appdata%/chancoin` on Windows and `/home/<username>/.chancoin` on Linux. You can [download](https://raw.githubusercontent.com/Michael4CHN/ChanCoin-for-4chan/master/chancoin.conf) the .conf file from the repository or copy and paste the following:


```
rpcuser=username
rpcpassword=password
rpcallowip=127.0.0.1
rpcport=43814
server=1
```

Save this file as `chancoin.conf`.

If the wallet is currently running, it will need to be restarted before the changes take effect.

### Step 2
The next step is to install the extension. 

To do this, navigate to `chrome://extensions/` within chrome.
Download the packed [Chrome Extension](https://github.com/VladimirPewtin/CHANCOIN-TippingExtension/releases/download/0.0.2/CHANCOIN_TippingExtension.crx)
and drag the downloaded file into the chrome extensions window. After accepting the permissions, the extension will be installed and ready to go.
___

If you like what I do, feel free to donate!

4CHN: `CbaNhNEnVBEx4CmCtDSatEhhwLp9WaCLjQ`

BTC: `1L4oM2DRtGseFLBLsUrgyMoM1oZv3FCbCz`
