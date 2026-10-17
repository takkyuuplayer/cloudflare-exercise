terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
  }
}

# The provider reads the API token from the CLOUDFLARE_API_TOKEN environment variable.
provider "cloudflare" {}

# Set with the TF_VAR_account_id environment variable, so the ID is not written in this public repository.
variable "account_id" {
  type        = string
  description = "Cloudflare Account ID"
}

data "cloudflare_account" "this" {
  account_id = var.account_id
}

output "account_name" {
  value = data.cloudflare_account.this.name
}
