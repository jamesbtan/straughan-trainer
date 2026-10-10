lint revset:
    jj run -r '{{revset}}' -- bash -c 'npx oxlint --deny-warnings $(find src -type f)'

fmt revset:
    jj run -r '{{revset}}' --restore-descendants -- bash -c 'npx oxfmt $(find src -type f)'
