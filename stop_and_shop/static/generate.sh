#!/usr/bin/env bash
cat stop-and-shop-produce.txt | sed -n '/^[^ #]/p' | jq -R 'split("\t")' |  jq -s '[.[] | {"\(.[0])": .[1]}] | sort_by(.[]) | add' | tee 'produce_list.json'
