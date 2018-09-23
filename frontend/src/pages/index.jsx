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

// const user2private = require('./keys/useraaaaaaab');
// const user2public = require('./keys/useraaaaaaab.pub');

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
    let JSEncrypt = new jsencrypt();

    // collect form data
    let account = a1.name;
    let account2 = a2.name;
    let privateKey = a1.privateKey;
    let privateKey2 = a2.privateKey;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};


    JSEncrypt.setPrivateKey(user1private);
    // console.log(JSEncrypt, CryptoJS.SHA256);
    // let val = JSEncrypt.sign(event.target.credentials.value, CryptoJS.SHA256, "sha256");
    // console.log(val);

    // define actionName and action according to event type
    switch (event.target.type.value) {
      case "store":
        actionName = "addasset";
        actionData = {
          _usr: account,
          _asset_name: 'test',
          _encrypted_asset_content: JSEncrypt.sign(event.target.credentials.value, CryptoJS.SHA256, "sha256")
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
        account: "venturerocks",
        name: actionName,
        authorization: [{
          actor: account,
          permission: 'active',
        }],
        data: actionData,
      }],
    });

    console.log(result);
    this.getTable();
  }

  // gets table data from the blockchain
  getTable() {
    const eos = Eos({
      httpEndpoint: endpoint,
    });
    eos.getTableRows({
      "json": true,
      "code": "venturerocks",   // contract who owns the table
      "scope": "venturerocks",  // scope of the table
      "table": "account",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ credentials: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { credentials } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    // const generateCard = (key, user, assets, public_rsa) => (
    //   <Card className={classes.card} key={key}>
    //     <CardContent>
    //       <Typography variant="headline" component="h2" size={16}>
    //         {user}
    //       </Typography>
    //       <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
    //         {new Date(timestamp*1000).toString()}
    //       </Typography>
    //       <ExpansionPanel>
    //         <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    //           <Typography className={classes.heading}>Expansion Panel 1</Typography>
    //         </ExpansionPanelSummary>
    //         <ExpansionPanelDetails>
    //           <Typography>
    //             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
    //             sit amet blandit leo lobortis eget.
    //           </Typography>
    //         </ExpansionPanelDetails>
    //       </ExpansionPanel>
    //       <Grid container spacing={16}>
    //         <Grid item>
    //           <form onSubmit={this.handleFormEvent}>
    //             <input type="hidden" name="type" value="transfer" />
    //             <input type="hidden" name="uid" value={uid} />
    //             <Button
    //               variant="contained"
    //               color="primary"
    //               className={classes.formButton}
    //               type="submit">
    //               Share credentials with useraaaaaaab
    //             </Button>
    //           </form>
    //         </Grid>
    //         <Grid item>
    //           <form onSubmit={this.handleFormEvent}>
    //             <input type="hidden" name="type" value="destroy" />
    //             <input type="hidden" name="uid" value={uid} />
    //             <Button
    //               variant="contained"
    //               color="primary"
    //               className={classes.formButton}
    //               type="submit">
    //               Delete
    //             </Button>
    //           </form>
    //         </Grid>
    //       </Grid>
    //     </CardContent>
    //   </Card>
    // );



    const printAssets = (key, asset) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography>{asset}</Typography>
        </CardContent>
      </Card>
    );

    const printCredentials = (key, user, assets, public_rsa) => (
      <ExpansionPanel key={key}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{user} ({assets.length})</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {assets.length ? (
            assets.map((row, i) => printAssets(i, row))
          ) : (
            <Typography>There are no credentials assigned to this user.</Typography>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );

    let storedCredentials = credentials.map((row, i) => {
      if (row.acc_name == 'useraaaaaaaa') {
        return printCredentials(i, row.acc_name, row.owned_assets, row.publicRSA)
      }
    });

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">BLOCKWAY</Typography>
          </Toolbar>
        </AppBar>
        <Typography variant="headline" component="h2" align="center" className={classes.wrap}>
          List of available credentials
        </Typography>

        <div className={classes.wrap}>
          { storedCredentials }
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
      </div>
    );
  }

}

export default withStyles(styles)(Index);
