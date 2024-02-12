#!/bin/bash

# Default values
N=10
offset=1
post_type='page'
title='Page'

# Parse command line arguments
while (("$#")); do
  case "$1" in
    --num)
      N=$2
      shift 2
      ;;
	--offset)
      offset=$2
      shift 2
      ;;
	--title)
	  title=$2
      shift 2
      ;;
    --type)
      post_type=$2
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

lorem_ipsum="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."

for ((i=offset; i<offset+N; i++)); do
   yarn wp-env run cli "wp post create --post_type='$post_type' --post_status=publish --post_title='$title $i' --post_content='$lorem_ipsum'"
done
