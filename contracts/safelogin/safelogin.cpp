#include <safelogin/safelogin.hpp>

void safelogin::registerfor(account_name _user, std::string website, checksum256 password){

  require_auth(_user);

  accountIndex _registry(_self,_self);

  auto itr = _registry.find(_user);

  if(itr == _registry.end()){               //If it's their first registry of all time
    _registry.emplace(_self,[&](auto &reg){
      reg.acc_name = _user;
      reg.websites_registered.push_back(website);
      reg.encrypted_passwords.push_back(password);
    });
  }
  else{
    _registry.modify(itr,_self,[&](auto reg){
      auto website_nr = reg.websites_registered.size();
      for(uint64_t e = 0; e<website_nr;e++) eosio_assert(reg.websites_registered[e]!=website,"You have already registered for this website");

      reg.websites_registered.push_back(website);
      reg.encrypted_passwords.push_back(password);
  });
  }

};

void safelogin::login(account_name _user, std::string website, checksum256 password){

  require_auth(_user);

  accountIndex _vault(_self,_self);

  auto itr = _vault.find(_user);


  eosio_assert(itr != _vault.end(),"Account is not registered");


  uint64_t size = itr->websites_registered.size();

  int index = 0;

  for(uint64_t e=0; e<size; e++){
     if(itr->websites_registered[e] == website){ index = e;
       break;
     }
   }

   eosio_assert(website == itr->websites_registered[index], "You are not registered for this website");

   if(itr->encrypted_passwords[index] == password) print("Succesful login");
   else print("Login failed");

}

EOSIO_ABI(safelogin,(registerfor)(login))
