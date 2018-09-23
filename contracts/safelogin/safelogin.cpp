#include <safelogin/safelogin.hpp>

void safelogin::initusr(account_name _usr, std::string _publicRSA){

  require_auth(_usr);

  accountIndex initializer(_self,_self);

  initializer.emplace(_self,[&](auto &a){

    a.acc_name = _usr;
    a.publicRSA = _publicRSA;

  });

}

void safelogin::addasset(account_name _usr,std::string _asset_name,std::string _encrypted_asset_content){

  require_auth(_usr);

  assetIndex adder(_self,_self);
  accountIndex accAdder(_self,_self);

  auto itr = accAdder.find(_usr);
  eosio_assert(itr != accAdder.end(), "User non existant account");

  adder.emplace(_self,[&](auto &a){
    a.ID = adder.available_primary_key()+10000;
    a.asset_name = _asset_name;
    a.encrypted_asset_content = _encrypted_asset_content;
    a.owner = _usr;

    accAdder.modify(itr,_self,[&](auto &m){

      m.owned_assets.push_back(a.ID);

    });

  });

}

 void safelogin::remove(account_name _usr, uint64_t asset_id){

   require_auth(_usr);

   assetIndex assetRem(_self,_self);
   accountIndex accRem(_self,_self);

   auto accItr = accRem.find(_usr);
   auto assetItr = assetRem.find(asset_id);

   eosio_assert(accItr != accRem.end(),"No account found");
   eosio_assert(assetItr != assetRem.end(), "No asset found");

   assetRem.erase(assetItr);

   accRem.modify(accItr,_self,[&](auto &r){

     uint64_t size = r.owned_assets.size();

     uint64_t rm_index = 0;

     for(uint64_t e=0; e<size; e++) if(r.owned_assets[e] == asset_id) rm_index = e;

     r.owned_assets.erase(r.owned_assets.begin()+rm_index);

   });
 }

 void safelogin::proposedup(account_name sender,account_name receiver, uint64_t asset_id, std::string recrypted_asset){

   require_auth(sender);

   accountIndex duplicator(_self,_self);
   assetIndex checker(_self,_self);
   auto Accitr = duplicator.find(sender);
   auto AssetItr = checker.find(asset_id);

   eosio_assert(Accitr != duplicator.end(),"There is no such account");
   eosio_assert(AssetItr != checker.end(), "There is no such asset");

   uint64_t index = -1;
   uint64_t size = Accitr->owned_assets.size();

   for(uint64_t e=0; e<size; e++) if(Accitr->owned_assets[e] == asset_id) index = e;

   eosio_assert(index != -1, "You don't own that asset");

   duplicator.modify(Accitr, _self,[&](auto &a){

     a.assetToGive = recrypted_asset;
     a.assetNameToGive = AssetItr->asset_name;
   });

 };

 void safelogin::acceptdup(account_name acceptor, account_name duplicator){

   require_auth(acceptor);

   accountIndex duplication(_self,_self);
   assetIndex duplicationA(_self,_self);
   auto itr = duplication.find(duplicator);
   auto itrA = duplication.find(acceptor);
   eosio_assert(itr != duplication.end(), "Account does not exist");
   eosio_assert(itrA != duplication.end(), "Account does not exist");


   duplicationA.emplace(_self,[&](auto &e){

     e.ID = duplication.available_primary_key()+10000;
     e.asset_name =itr->assetNameToGive;
     e.encrypted_asset_content = itr->assetToGive;
     e.owner = acceptor;

     duplication.modify(itrA,_self,[&](auto &a){

       a.owned_assets.push_back(e.ID);

     });

   });

 }


EOSIO_ABI(safelogin,(initusr)(addasset)(remove)(proposedup)(acceptdup))
