/// @abi table accounts i64
struct accounts{

  account_name acc_name;
  std::vector<std::string> websites_registered;
  std::vector<checksum256> encrypted_passwords;

  uint64_t primary_key() const { return acc_name;}

  EOSLIB_SERIALIZE(accounts,(acc_name)(websites_registered)(encrypted_passwords))
};
