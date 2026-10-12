lint revset:
    jj run -j 4 -r '{{revset}}' -- bash -c 'npx oxlint --deny-warnings $(find src -type f)'

fmt revset:
    jj run -j 4 -r '{{revset}}' --restore-descendants -- bash -c 'npx oxfmt $(find src -type f)'

tsc revset:
    jj run -j 4 -r '{{revset}}' -- bash -c 'tsc'
