FROM mcr.microsoft.com/devcontainers/base:jammy
# FROM mcr.microsoft.com/devcontainers/base:jammy 

ARG DEBIAN_FRONTEND=noninteractive
ARG USER=vscode

RUN DEBIAN_FRONTEND=noninteractive \
    && apt-get update \ 
    && apt-get install -y build-essential --no-install-recommends make \
        ca-certificates \
        git \
        libssl-dev \
        zlib1g-dev \
        libbz2-dev \
        libreadline-dev \
        libsqlite3-dev \
        wget \
        curl \
        llvm \
        libncurses5-dev \
        xz-utils \
        tk-dev \
        libxml2-dev \
        libxmlsec1-dev \
        libffi-dev \
        liblzma-dev

# Python and poetry installation
USER $USER
ARG HOME="/home/$USER"
ARG PYTHON_VERSION=3.13
# ARG PYTHON_VERSION=3.10

ENV PYENV_ROOT="${HOME}/.pyenv"
ENV PATH="${PYENV_ROOT}/shims:${PYENV_ROOT}/bin:${HOME}/.local/bin:$PATH"

RUN echo "Setting up Python ${PYTHON_VERSION}" \
    && echo "downloading pyenv" \
    && curl https://pyenv.run | bash \
    && echo "installing python ${PYTHON_VERSION}" \
    && pyenv install ${PYTHON_VERSION} \
    && echo "setting global python version to ${PYTHON_VERSION}" \
    && pyenv global ${PYTHON_VERSION} \
    && echo "installing poetry" \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && poetry config virtualenvs.in-project true

# setup ocaml
# Avoid any interactive prompts from opam and the installer
ENV OPAMYES=1

RUN echo "installing ocaml and opam" \
    && echo "downloading ocaml" \
    && yes "" | bash -c "sh <(curl -fsSL https://opam.ocaml.org/install.sh)" \
    && echo "initializing opam" \
    && opam init -a -y --disable-sandboxing --shell=bash \
    && echo "creating opam switch" \
    && opam switch create -y 5.3.0 \
    && eval "$(opam env)" \
    && echo "installing ocaml packages" \
    && opam install -y ocaml-lsp-server odoc ocamlformat utop