# Generate Demo Webpack Plugin

This plugin creates a `demo.json` in the defined distribution folder. After that it's up to the web app to generate a website out of it.

```
- excludes string[]
- includes string[]
- namespaces[]
  - name
  - folder
  - components[]
    - order number
    - file string
    - files[]
      - name string
      - file string
    - name string
    - namespace string
    - tag string
    - hasExamplesFolder bool
    - examplesFolder string
    - jsdoc
      - name string
      - description string
      - type string[]
      - defaultValue string
      - order string
    - examples[]
      - name string
      - folder string
      - files: []
        - name string
        - file string
      - errors: [],
      - warnings: [],
```