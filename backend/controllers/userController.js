const User = require("../models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const algosdk = require( "algosdk" );

const myAccount = {
	addr: "LVRIHBMGFA7YUSXDITNY6VU3N7OPFX7DV2VQCKZGS6OJMN7YBMMYYNQQME",
	sk: new Uint8Array([129,197,151,109,216,62,79,9,124,64,93,18,139,183,202,153,84,200,113,16,251,195,175,31,170,80,60,82,137,183,116,141,93,98,131,133,134,40,63,138,74,227,68,219,143,86,155,111,220,242,223,227,174,171,1,43,38,151,156,150,55,248,11,25])
};


const signUp = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const alreadyExists = await User.findOne({ email });
		if (alreadyExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash( password, salt );
		const myaccount = algosdk.generateAccount();
		const user = new User({
			name,
			email,
			password: hashedPassword,
			algorandAccount: myaccount,
		});
		await user.save();
		if (!user) {
			return res.status(400).json({ message: "User not created" });
		}
		res.status(200).json({ message: "User created successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal Server Error");
	}
};



const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const alreadyExists = await User.findOne({ email });
		if (!alreadyExists) {
			return res.status(400).json({ message: "User does not exists" });
		}
		const isMatch = await bcrypt.compare(password, alreadyExists.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		res.status(200).json({ message: "User logged in successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal Server Error");
	}
};

const savePassword = async (req, res) => {
	try {
		const { email, toSave, saveFor } = req.body;
		const user = await User.findOne( { email } );
    if ( !user ) {
      return res.status(400).json({ message: "User not found" });
    }
		// Connect your client
		const algodToken =
			"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		const algodServer = "http://localhost";
		const algodPort = 4001;
		let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

		//Check your balance
		let accountInfo = await algodClient.accountInformation(myAccount.addr).do();

		// Construct the transaction
		let params = await algodClient.getTransactionParams().do();
		params.fee = algosdk.ALGORAND_MIN_TX_FEE;
		params.flatFee = true;


		// receiver defined as TestNet faucet address
		const receiver =
			"HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
		const enc = new TextEncoder();
		const note = enc.encode(toSave);
		let amount = 1000000;
		let sender = myAccount.addr;
		let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
			from: sender,
			to: receiver,
			amount: amount,
			note: note,
			suggestedParams: params,
    } );
    
    if ( accountInfo.amount < amount ) {
      return res.status(400).json({ message: "Insufficient balance. Please fund your account first!" });
    }

		// Sign the transaction
		let signedTxn = txn.signTxn(myAccount.sk);
		let txId = txn.txID().toString();

		// Submit the transaction
		await algodClient.sendRawTransaction( signedTxn ).do();

		// Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation( algodClient, txId, 4 );
    
    if ( !confirmedTxn ) {
      return res.status(400).json({ message: "Password not saved" });
		}
    user.savedPasswordsTxns.push( { "txn_id": txId, "for": saveFor, "tnx_info": confirmedTxn } );
		await user.save();
		res.status(200).json({ message: "Password saved successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal Server Error");
	}
};


const getSavedPasswords = async ( req, res ) => {
  try {
    const { email } = req.body;
    const user = await User.findOne( { email } );
    if ( !user ) {
      return res.status(400).json({ message: "User not found" });
    }
    const savedPasswords = [];
    for ( let i = 0; i < user.savedPasswordsTxns.length; i++ ) {
			const savedFor = user.savedPasswordsTxns[ i ].for;
      const txnInfo = user.savedPasswordsTxns[i].tnx_info;
			const string = txnInfo.txn.txn.note.toString()
      savedPasswords.push( { "for": savedFor, "password": string } );
    }
    res.status(200).json( { "savedPasswords": savedPasswords } );
  } catch ( error ) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}



const deletePassword = async ( req, res ) => {
  try {
    const { email, txnId } = req.body;
    // Delete txnId from user's savedPasswordsTxns
    const user = await User.findOne( { email } );
    for( let i = 0; i < user.savedPasswordsTxns.length; i++ ) {
      if ( user.savedPasswordsTxns[i].txn_id === txnId ) {
        user.savedPasswordsTxns.splice(i, 1);
        break;
      }
		}
		await user.save();
		res.status(200).json({ message: "Password deleted successfully" });
  } catch ( error ) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { signUp, login, savePassword, getSavedPasswords, deletePassword };