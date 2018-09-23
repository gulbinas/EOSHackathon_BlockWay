/// @abi table accounts i64
struct accounts{

  account_name acc_name;
  std::string publicRSA;
  std::vector<uint64_t> owned_assets;
  std::string assetToGive;
  std::string assetNameToGive;

  uint64_t primary_key() const { return acc_name;}

  EOSLIB_SERIALIZE(accounts,(acc_name)(publicRSA)(owned_assets)(assetToGive)(assetNameToGive))
};
