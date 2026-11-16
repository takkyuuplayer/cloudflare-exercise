terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
  }
}

# Not read from CLOUDFLARE_API_TOKEN, because wrangler reads the same variable and needs a different token.
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Set with the TF_VAR_cloudflare_api_token environment variable.
variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token for Terraform"
  sensitive   = true
}

# Set with the TF_VAR_account_id environment variable, so the ID is not written in this public repository.
variable "account_id" {
  type        = string
  description = "Cloudflare Account ID"
}

resource "cloudflare_workers_kv_namespace" "lab" {
  account_id = var.account_id
  title      = "02-iac-basics"
}

output "kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.lab.id
}
