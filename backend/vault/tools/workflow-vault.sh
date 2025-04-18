#!/bin/sh
set -e  # Exit on error

vault server -config /vault/config/config.hcl
VAULT_PID=$!

# Export required variables
export VAULT_ADDR='https://127.0.0.1:8200'
export VAULT_SKIP_VERIFY='true'  # Self-signed cert workaround

# find a better way to do this check
if vault status | grep -q "Initialized.*true"; then
  echo "Vault is already initialized."
else

  # Initialize Vault
  vault operator init -key-shares=3 -key-threshold=2 > /vault/data/generated_keys.txt

  # Parse unseal keys (alternative to `mapfile`) maybe we can do a loop
  keyArray=$(grep "Unseal Key " /vault/data/generated_keys.txt | cut -d ' ' -f4 | tr '\n' ' ')
  set -- $keyArray
  vault operator unseal "$1"
  vault operator unseal "$2"
  vault operator unseal "$3"

  # Extract root token
  rootToken=$(grep "Initial Root Token: " /vault/data/generated_keys.txt | cut -d ' ' -f4)
  echo "$rootToken" > /vault/data/root_token.txt
  export VAULT_TOKEN="$rootToken"

  # Enable KV secrets engine
  vault secrets enable -version=1 kv

  # Enable userpass authentication
  vault auth enable userpass

  # Add policy for Fastify app
  vault policy write fastify-policy /vault/tools/fastify-policy.hcl
  vault write auth/userpass/users/admin password=admin policies=fastify-policy

  # Store test secret
  vault kv put kv/my-secret my-value=s3cr3t

  echo "Vault initialization completed!"

fi

vault status

wait $VAULT_PID
