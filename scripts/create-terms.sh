#!/bin/bash

N=10
taxonomy='category'
term_name='Term'

# Parse command line arguments
while (("$#")); do
  case "$1" in
    --num)
      N=$2
      shift 2
      ;;
    --name)
      term_name=$2
      shift 2
      ;;
    --taxonomy)
      taxonomy=$2
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

for ((i=1; i<=N; i++)); do
   yarn wp-env run cli "wp term create $taxonomy '$term_name $i'"
done
