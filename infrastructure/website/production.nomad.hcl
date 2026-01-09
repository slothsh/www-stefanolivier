variable "REGISTRY_USER" {
  type = string
  default = ""
}

variable "REGISTRY_PASSWORD" {
  type = string
  default = ""
}

job "website-stefanolivier" {
  namespace = "default"

  update {
    max_parallel      = 1
    health_check      = "task_states"
    min_healthy_time  = "10s"
    healthy_deadline  = "5m"
    progress_deadline = "10m"
    auto_revert       = true
    auto_promote      = true
    canary            = 1
  }

  group "website" {
    network {
      port "http" { to = 80 }
      port "ssr" { to = 13814 }
    }

    task "app" {
      driver = "docker"

      config {
        image = "registry.stefanolivier.com/website-stefanolivier:latest"

        auth {
          username = var.REGISTRY_USER
          password = var.REGISTRY_PASSWORD
        }

        ports = ["http", "ssr"]
      }

      service {
        name = "website-stefanolivier"
        provider = "consul"
        port = "http"
      }

      service {
        name = "website-stefanolivier-ssr"
        provider = "consul"
        port = "ssr"
      }

      vault {}

      template {
        data = <<EOF
        {{- with secret "kv/data/default/website-stefanolivier/certs/postgres" }}{{ .Data.data.ca }}{{ end }}
        EOF

        destination = "${NOMAD_SECRETS_DIR}/certs/postgres-ca.crt"
        change_mode = "restart"
        uid = 1001
        gid = 1001
        perms = "600"
      }

      template {
        data = <<EOF
        {{- with secret "kv/data/default/website-stefanolivier/certs/postgres" }}{{ .Data.data.cert }}{{ end }}
        EOF

        destination = "${NOMAD_SECRETS_DIR}/certs/postgres.crt"
        change_mode = "restart"
        uid = 1001
        gid = 1001
        perms = "600"
      }

      template {
        data = <<EOF
        {{- with secret "kv/data/default/website-stefanolivier/certs/postgres" }}{{ .Data.data.key }}{{ end }}
        EOF

        destination = "${NOMAD_SECRETS_DIR}/certs/postgres.key"
        change_mode = "restart"
        uid = 1001
        gid = 1001
        perms = "600"
      }
    }
  }
}
