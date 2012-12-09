# export KLA_KINDLING_SHARED_SECRET=""

npm install
export KLA_KINDLING_ACCOUNT_ENDPOINT="radialpoint.kindlingapp.com"
export KLA_LDAP_SERVER_URL = "ldaps://yul01wdc02.rp.corp:636"
export KLA_LDAP_BASE = "OU=Users,OU=Managed Objects,DC=rp,DC=corp"
export KLA_LDAP_USER_DOMAIN = "rp"

node app.js
