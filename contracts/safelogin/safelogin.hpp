#include <eosiolib/eosio.hpp>
#include <vector>
#include <eosiolib/print.hpp>
#include <safelogin/tables/accountTable.h>
#include <safelogin/typedefs/typedefs.h>
#include <eosiolib/crypto.h>

using namespace eosio;

class safelogin : public eosio::contract {
  public:
      using contract::contract;

    //@abi action
    void registerfor(account_name _user, std::string website, checksum256 password);

    //@abi action
    void login(account_name _user, std::string website, checksum256 password);

};
