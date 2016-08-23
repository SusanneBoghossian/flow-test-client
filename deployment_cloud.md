
open powershell

download cloud foundry cli, if needed:
https://github.com/cloudfoundry/cli/releases

open `\serve` path

````cf login -u edi.spring@lambda-it.ch````

````cf push FlowWebClient````

status:
``cf app FlowWebClient``

events:
``cf events FlowWebClient``
