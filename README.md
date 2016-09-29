# routebot
 routebot is a serverless slak bot build using AWS Lambda and API Gateway.
 It is a bot which provides route between two places, which lets you request the route details between two places with a command 
`route from <origin> to <destination>` which internally uses google directions service.

The Route details which include Duration, Distance and Driving instructions will be posted into your Slack channel.

## Usage
 `route from <origin> to <destination>`
 
 The trigger word for this bot has been configured as "route" in Slack Custom Integration, so when you type route in Slack the bot gets triggered.

 If you do not provide the command as mentioned above, it will post the usage command (route from <origin> to <destination>) into your Slack channel.

 If the route is not found, it will post the message (Route not found, Please provide clear locations) into your Slack channel.

## Examples
### Below is the example for command "route from Lonon to Wales"
 
 ![alt tag](./imgs/route_from_londo_to_wales)

### Below is the example when when route is not found

  endrapunaveen [5:15 PM] 
  route from test to test123

  routebot BOT [5:19 PM]  
  Route not found, Please provide clear locations

