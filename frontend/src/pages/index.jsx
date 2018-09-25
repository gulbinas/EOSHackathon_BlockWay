import React, { Component } from 'react';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs
import jsencrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [
  {"name":"useraaaaaaaa", "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"},
  {"name":"useraaaaaaab", "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"},
  {"name":"useraaaaaaac", "privateKey":"5K2jun7wohStgiCDSDYjk3eteRH1KaxUQsZTEmTGPH4GS9vVFb7", "publicKey":"EOS5yd9aufDv7MqMquGcQdD6Bfmv6umqSuh9ru3kheDBqbi6vtJ58"},
  {"name":"useraaaaaaad", "privateKey":"5KNm1BgaopP9n5NqJDo9rbr49zJFWJTMJheLoLM5b7gjdhqAwCx", "publicKey":"EOS8LoJJUU3dhiFyJ5HmsMiAuNLGc6HMkxF4Etx6pxLRG7FU89x6X"},
  {"name":"useraaaaaaae", "privateKey":"5KE2UNPCZX5QepKcLpLXVCLdAw7dBfJFJnuCHhXUf61hPRMtUZg", "publicKey":"EOS7XPiPuL3jbgpfS3FFmjtXK62Th9n2WZdvJb6XLygAghfx1W7Nb"},
  {"name":"useraaaaaaaf", "privateKey":"5KaqYiQzKsXXXxVvrG8Q3ECZdQAj2hNcvCgGEubRvvq7CU3LySK", "publicKey":"EOS5btzHW33f9zbhkwjJTYsoyRzXUNstx1Da9X2nTzk8BQztxoP3H"},
  {"name":"useraaaaaaag", "privateKey":"5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo", "publicKey":"EOS8Du668rSVDE3KkmhwKkmAyxdBd73B51FKE7SjkKe5YERBULMrw"}
];

const user1private = [
  '-----BEGIN RSA PRIVATE KEY-----',
  'MIICXgIBAAKBgQDIDhTzCZvkwXp+EqyDXKXTpAOoXetaCGf1yDAXQET/REP9cHKf',
  'yhq9peNties4pfeR/jzKQiUGeRmcSHq//Vu4CfTMaUgXvnQkfNe5Jy/quyC/P1yb',
  'Ba8dF5VNp99+NGTH4qnINSqGUPpkMWEbmgJyi1035NkZ06hN05S9gUqHPwIDAQAB',
  'AoGAW1HyRi7wtq+LFtm3Xg+Asud/s++La4HC0vMa4MI5vLyQvLQD3uUG5+M9udbn',
  'ROid5krDvSAMfrPw+OItBk7E+qMPxB0vaK1pDfYy/jcwqyPWiVYdB2qVei4VCmEI',
  'hvi1KqH+7CB7thWxVMWeJxYSQoaEvKhM9iK2IJqa3hDZPgECQQDlh0fiu5qY+8+A',
  'lCENUGeO+iDnJYZcJBlK1VVaub8nUvMbxfgbRE/VXgZ2x9+GZbAp8P/7fEpdUpCh',
  'mcCnNtD/AkEA3yCcnWI77sqOSptAYyIRdXSVIaI0dukR8LJ6zKkVZpPoXPi1cRUV',
  'tqk/2xdc+AvcsjW7jFBUg4uNnEQ7fmIJwQJBAN73+60V8aiLdZfCThlQ8kjCUxQ4',
  'L71yk99OPgxURI0+10szlUFnquXq4PyiTVGRlwAnTYRPyS2+9yEE61GEvqECQQDG',
  'C7I3V4wOxadKvUaHNyP79wCvm8Opj/ImjKTGp4WhSMNEUlTqDGb7fHp7Qt94Iz8+',
  'xsazIlIBeIq3GzEbWnWBAkEA5ItDlfbhTCvw6xtzBiYazAyRw6b2kZzs7blYp0Fa',
  'Rnj0wYN/ce424kOV7iXkc13Ws4nYS1dERgUOpQ+DO3waSQ==',
  '-----END RSA PRIVATE KEY-----'
].join('');

const user2private = [
  '-----BEGIN RSA PRIVATE KEY-----',
  'MIICXgIBAAKBgQDIDhTzCZvkwXp+EqyDXKXTpAOoXetaCGf1yDAXQET/REP9cHKf',
  'yhq9peNties4pfeR/jzKQiUGeRmcSHq//Vu4CfTMaUgXvnQkfNe5Jy/quyC/P1yb',
  'Ba8dF5VNp99+NGTH4qnINSqGUPpkMWEbmgJyi1035NkZ06hN05S9gUqHPwIDAQAB',
  'AoGAW1HyRi7wtq+LFtm3Xg+Asud/s++La4HC0vMa4MI5vLyQvLQD3uUG5+M9udbn',
  'ROid5krDvSAMfrPw+OItBk7E+qMPxB0vaK1pDfYy/jcwqyPWiVYdB2qVei4VCmEI',
  'hvi1KqH+7CB7thWxVMWeJxYSQoaEvKhM9iK2IJqa3hDZPgECQQDlh0fiu5qY+8+A',
  'lCENUGeO+iDnJYZcJBlK1VVaub8nUvMbxfgbRE/VXgZ2x9+GZbAp8P/7fEpdUpCh',
  'mcCnNtD/AkEA3yCcnWI77sqOSptAYyIRdXSVIaI0dukR8LJ6zKkVZpPoXPi1cRUV',
  'tqk/2xdc+AvcsjW7jFBUg4uNnEQ7fmIJwQJBAN73+60V8aiLdZfCThlQ8kjCUxQ4',
  'L71yk99OPgxURI0+10szlUFnquXq4PyiTVGRlwAnTYRPyS2+9yEE61GEvqECQQDG',
  'C7I3V4wOxadKvUaHNyP79wCvm8Opj/ImjKTGp4WhSMNEUlTqDGb7fHp7Qt94Iz8+',
  'xsazIlIBeIq3GzEbWnWBAkEA5ItDlfbhTCvw6xtzBiYazAyRw6b2kZzs7blYp0Fa',
  'Rnj0wYN/ce424kOV7iXkc13Ws4nYS1dERgUOpQ+DO3waSQ==',
  '-----END RSA PRIVATE KEY-----'
].join('');

const user1public = [
  '-----BEGIN PUBLIC KEY-----',
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIDhTzCZvkwXp+EqyDXKXTpAOo',
  'XetaCGf1yDAXQET/REP9cHKfyhq9peNties4pfeR/jzKQiUGeRmcSHq//Vu4CfTM',
  'aUgXvnQkfNe5Jy/quyC/P1ybBa8dF5VNp99+NGTH4qnINSqGUPpkMWEbmgJyi103',
  '5NkZ06hN05S9gUqHPwIDAQAB',
  '-----END PUBLIC KEY-----'

].join('');

const user2public = [
  '-----BEGIN PUBLIC KEY-----',
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC56C7ACOTiTL0rGElWTtqbsPbr',
  '+Yrm7ErGKxqrDjKaUlXBFzoF5AWBHho7YslFrHJK4QOkOAyORBbGOi2SDRJeHYFO',
  'NZZgudZCDax1m0Xg0GE8UgsJxxQfFr94dHf1aEWnww4vZ92GRJk6QiysBJYDAlAl',
  'gDWpkn+CBiNkFDdTNwIDAQAB',
  '-----END PUBLIC KEY-----'
];

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  wrap: {
    margin: 20,
  },
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  }
});

const endpoint = 'http://10.20.3.30:8888';

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      credentials: [], // to store the table rows from smart contract
      showtransfer: false,
      loading: true,
      assets: []
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    const a1 = accounts[0];
    const a2 = accounts[1];

    // collect form data
    let account = a1.name;
    let account2 = a2.name;
    let privateKey = a1.privateKey;
    let privateKey2 = a2.privateKey;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};


    let encrypt = new jsencrypt();
    encrypt.setPublicKey(user1private);

    // define actionName and action according to event type
    switch (event.target.type.value) {
      case "store":
        actionName = "addasset";
        actionData = {
          _usr: account,
          _asset_name: '{WEB_RESOURCE}',
          _encrypted_asset_content: encrypt.encrypt(event.target.credentials.value)
        };
        break;
      case "transfer":
        actionName = "transfer";
        actionData = {
          _account_from: account,
          _account_to: account2,
          _uid: event.target.uid.value
        };
        break;
      case "accept":
        actionName = "accept";
        actionData = {
          _account_from: account,
          _account_to: account2,
          _uid: event.target.uid.value
        };
        break;
      default:
        return;
    }

    // // eosjs function call: connect to the blockchain
    const eos = Eos({
      httpEndpoint: endpoint,
      keyProvider: privateKey,
    });

    // console.log(actionData);
    const result = await eos.transaction({
      actions: [{
        account: "testh",
        name: actionName,
        authorization: [{
          actor: account,
          permission: 'active',
        }],
        data: actionData,
      }],
    });

    this.getTable();
    this.getAsset();
  }

  // gets table data from the blockchain
  getTable() {
    const eos = Eos({
      httpEndpoint: endpoint,
    });
    eos.getTableRows({
      "json": true,
      "code": "testh",   // contract who owns the table
      "scope": "testh",  // scope of the table
      "table": "account",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ credentials: result.rows }));
  }

  getAsset(assetId) {
    const eos = Eos({
      httpEndpoint: endpoint,
    });

    eos.getTableRows({
      "json": true,
      "code": "testh",   // contract who owns the table
      "scope": "testh",  // scope of the table
      "table": "assets",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => {
      this.setState({ assets: result.rows, loading: false })
    });
  }

  componentDidMount() {
    this.getTable();
    this.getAsset();
  }

  showTransferBut() {
    this.setState({showtransfer: true});
  }

  async proposedup(asset_id, encrypted_asset_content, public_rsa ) {
    "use strict";

      const account = accounts[0].name;
      const privateKey = accounts[0].privateKey;
      const eos = Eos({
        httpEndpoint: endpoint,
        keyProvider: privateKey,
      });

      let decrypt = new jsencrypt();
      decrypt.setPrivateKey(user1private);

      let decrypted = decrypt.decrypt(encrypted_asset_content);

      let encrypt = new jsencrypt();
      encrypt.setPublicKey(user2private);

      let encoded = encrypt.encrypt(decrypted);

      let config = {
       chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
       httpEndpoint: endpoint,
       authorization: 'useraaaaaaaa@active',
       keyProvider: privateKey,
       expireInSeconds: 60,
       broadcast: true,
       verbose: false, // API activity
       sign: true
      }

      let eos2 = Eos(config);

      await eos2.contract('testh').then((testh) => {
        testh.proposedup(account, "useraaaaaaab", asset_id, encoded)
      });

      this.getAsset();
      this.acceptdup();
  }

  async acceptdup() {
    "use strict";

      const account = accounts[1].name;
      const privateKey = accounts[1].privateKey;
      // const eos = Eos({
      //   httpEndpoint: endpoint,
      //   keyProvider: privateKey,
      // });

      // let decrypt = new jsencrypt();
      // decrypt.setPrivateKey(user1private);
      //
      // let decrypted = decrypt.decrypt(encrypted_asset_content);
      //
      // let encrypt = new jsencrypt();
      // encrypt.setPublicKey(user2private);
      //
      // let encoded = encrypt.encrypt(decrypted);
      //
      // console.log(encoded);

      let config = {
       chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
       httpEndpoint: endpoint,
       authorization: 'useraaaaaaab@active',
       keyProvider: privateKey,
       expireInSeconds: 60,
       broadcast: true,
       verbose: false, // API activity
       sign: true
      }

      let eos2 = Eos(config);

      await eos2.contract('testh').then((testh) => {
        testh.acceptdup('useraaaaaaab', "useraaaaaaaa")
      });

      this.getAsset();
  }

  async deleteAsset(asset_id, user) {
    "use strict";

    console.log(asset_id, user);

    const account = accounts[1].name;
    const privateKey = accounts[1].privateKey;

    let config = {
     chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
     httpEndpoint: endpoint,
     authorization: 'useraaaaaaaa@active',
     keyProvider: '5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5',
     expireInSeconds: 60,
     broadcast: true,
     verbose: false, // API activity
     sign: true
    }

    let eos = Eos(config);

    await eos.contract('testh').then((testh) => {
      testh.remove("useraaaaaaaa", asset_id)
    });

    this.getAsset();
  }

  async acceptAsset(asset_id, user) {
    "use strict";

    let config = {
     chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
     httpEndpoint: endpoint,
     authorization: 'useraaaaaaaa@active',
     keyProvider: '5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5',
     expireInSeconds: 60,
     broadcast: true,
     verbose: false, // API activity
     sign: true
    }

    let eos = Eos(config);

    await eos.contract('testh').then((testh) => {
      testh.remove("useraaaaaaaa",asset_id)
    });

    this.getAsset();
  }

  showPass(encoded) {

    let decrypt = new jsencrypt();
    decrypt.setPrivateKey(user1private);

    let decrypted = decrypt.decrypt(encoded);

    alert(decrypted);
  }

  render() {
    const { credentials, assets } = this.state;
    const { classes } = this.props;

    const printAssets = (key, asset_id, asset_name, encrypted_asset_content, user, userBbased) => (
      <ExpansionPanel key={key}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{asset_name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Button color="primary" onClick={(e) => { e.preventDefault(); this.deleteAsset(asset_id, user) }}>Delete credential</Button>
          { (userBbased != false) ? <Button color="primary" onClick={(e) => { e.preventDefault(); this.proposedup(asset_id, encrypted_asset_content, user) }}>Transfer to useraaaaaaab</Button> : ""}
          { (userBbased == false) ? <Button color="primary" onClick={(e) => { e.preventDefault(); this.showPass(encrypted_asset_content) }}>Show password</Button> : ""}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );

    let listAssets = assets.map((row, i) => {
      if (row.owner !== 'useraaaaaaaa') {
        return;
      }

      return printAssets(i, row.ID, row.asset_name, row.encrypted_asset_content, row.owner)
    });

    let listUserBAssets = assets.map((row, i) => {
        if (row.owner !== 'useraaaaaaab') {
          return;
        }
        return printAssets(i, row.ID, row.asset_name, row.encrypted_asset_content, row.owner, false)
    });

    if (this.state.loading) {
      return null;
    }

    return (

      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">BLOCKWAY</Typography>
          </Toolbar>
        </AppBar>

        <Grid container spacing={24}>
          <Grid item xs>
            <Typography variant="headline" component="h2" align="center" className={classes.wrap}>
              List of available credentials of <strong>useraaaaaaaa</strong>
            </Typography>

            <div className={classes.wrap}>
              { listAssets }
            </div>

            <Card className={classes.card}>
              <CardContent>
                <Typography variant="headline" component="h2">
                  Store credentials
                </Typography>
                <form onSubmit={this.handleFormEvent}>
                  <input type="hidden" name="type" value="store" />
                  <TextField
                    name="account"
                    autoComplete="off"
                    label="Account"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={accounts[0].name}
                    fullWidth
                  />
                  <TextField
                    name="privateKey"
                    autoComplete="off"
                    label="Private key"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={accounts[0].privateKey}
                    fullWidth
                  />
                  <TextField
                    name="credentials"
                    autoComplete="off"
                    label="Credentials"
                    margin="normal"
                    multiline
                    rows="10"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.formButton}
                    type="submit">
                    Store Credentials
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Typography variant="headline" component="h2" align="center" className={classes.wrap}>
              List of available credentials of <strong>useraaaaaaab</strong>
            </Typography>

            <div className={classes.wrap}>
              { listUserBAssets }
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

}

export default withStyles(styles)(Index);
