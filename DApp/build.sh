#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider
yarn build
cd dist
zip -r dist.zip *
