/// @abi table assets i64
struct assets{

  uint64_t ID;
  std::string asset_name;
  std::string encrypted_asset_content;
  account_name owner;

  uint64_t primary_key() const { return ID;}

  EOSLIB_SERIALIZE(assets,(ID)(asset_name)(encrypted_asset_content)(owner))
};
