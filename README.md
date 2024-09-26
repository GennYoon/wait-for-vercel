# Wait For Vercel

This action waits for a Vercel deployment to be ready.

# What's new

Please refer to the [release page](https://github.com/GennYoon/wait-for-vercel/releases) for the latest release notes.

# Usage

```yaml
- uses: GennYoon/wait-for-vercel@v0.3.0
  id: wait-for-vercel
  with:
    token: ""
    project-id: ""
    team-id: ""
    timeout: 300
    sha: ""

- name: Show output
  run: |
    echo "Vercel Url ${{ toJSON(step.wait-for-vercel.outputs) }}"
  shell: bash
```

# License

The scripts and documentation in this project are released under the [MIT License](https://github.com/GennYoon/wait-for-vercel/blob/main/LICENSE).
