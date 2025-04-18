ui = true
disable_mlock = "true"

storage "raft" {
  path    = "/vault/data"
  node_id = "node1"
}

listener "tcp" {
  address = "[::]:8200"
  tls_cert_file = "/certs/server.crt"
  tls_key_file  = "/certs/server.key"
}

api_addr = "https://127.0.0.1:8200"
cluster_addr = "https://127.0.0.1:8201"