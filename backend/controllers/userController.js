const User = require("../models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const algosdk = require("algosdk");

const myAccount = {
	addr: "PHRU55OSPT2RVXGUE5XPHPVMRYBTLLXVU7OVO7IQ5BRP2N6IQFR2C7ZZ74",
	sk: "3h32GoAbZyp0jw8jya/SFVrnBnwsCAySuTOqDv7KwrF540710nz1GtzUJ27zvqyOAzWu9afdV30Q6GL9N8iBYw==",
};

const signUp = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const alreadyExists = await Users.findOne({ email });
		if (alreadyExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = new User({
			name,
			email,
			password: hashedPassword,
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
		const alreadyExists = await Users.findOne({ email });
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
    const { email, toSave } = req.body;
		// Connect your client
		const algodToken =
			"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		const algodServer = "http://localhost";
		const algodPort = 4001;
		let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

		//Check your balance
		let accountInfo = await algodClient.accountInformation(myAccount.addr).do();
		console.log("Account balance: %d microAlgos", accountInfo.amount);

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
      return res.status(400).json({ message: "Insufficient balance" });
    }

		// Sign the transaction
		let signedTxn = txn.signTxn(myAccount.sk);
		let txId = txn.txID().toString();

		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation( algodClient, txId, 4 );
    
    if ( !confirmedTxn ) {
      return res.status(400).json({ message: "Password not saved" });
    }

    const user = await User.findOne( { email } );
    if ( !user ) {
      return res.status(400).json({ message: "User not found" });
    }
    user.savedPasswordsTxns.push( { "txn_id": txId, "tnx_info": confirmedTxn } );
    await user.save();
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
      const txnId = user.savedPasswordsTxns[i].txn_id;
      const txnInfo = user.savedPasswordsTxns[i].tnx_info;
      const string = new TextDecoder().decode(txnInfo.txn.txn.note);
      savedPasswords.push( { "txn_id": txnId, "password": string } );
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
  } catch ( error ) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}