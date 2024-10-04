# AWS Workshop IDE

Now that Amazon Cloud9 is deprecated, you cannot start a Cloud9 instance on a new account, except the ones that are provisionned by AWS.

This project helps deploying an EC2 instance with correct profile and SSH keys so that you can use easily the remote VS Code extension. You then benefit from the same kind of environment than Cloud9, but on your Laptop.


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


## Licensing

Source code in Composable Doc is copyright Comnposable Doc and
contributors, and licensed under the Apache License, Version 2.0.

See the [LICENSE](LICENSE) file for details.
