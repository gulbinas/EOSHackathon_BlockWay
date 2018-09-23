#include <eosiolib/eosio.hpp>
#include <vector>
#include <eosiolib/print.hpp>
#include <safelogin/tables/accountTable.h>
#include <safelogin/tables/assetTable.h>
#include <safelogin/typedefs/typedefs.h>
#include <eosiolib/crypto.h>

using namespace eosio;

class safelogin : public eosio::contract {
  public:
      using contract::contract;

//@abi action
 void initusr(account_name _usr, std::string _publicRSA);

 //@abi action
 void addasset(account_name _usr,std::string _asset_name,std::string _encrypted_asset_content);

//@abi action
 void remove(account_name _usr, uint64_t asset_id);

 //@abi action
 void proposedup(account_name sender,account_name receiver, uint64_t asset_id, std::string recrypted_asset);

 //@abi action
 void acceptdup(account_name acceptor,account_name duplicator);

};
