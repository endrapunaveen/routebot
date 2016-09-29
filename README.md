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
  
# Installation and Setup

1. clone this project using `git clone https://github.com/endrapunaveen/routebot.git`
2. change the dir using `cd routebot`
3. execute `npm install` to install all the dependent node modules mentioned in package.json
4. Zip all the files and directories available in routebot like "node_modules", "index.js", "package.json" into routebot.zip
5. Create your Lambda function that will process all Slack Requests and upload the above created zip (routebot.zip)
3. Create an API Gateway API
4. Create a method of type: POST
5. Select Integration Type: Lambda
6. Select the region in which you created your Lambda function
7. Select the Lambda Function you created
8. Click "Integration Request"
9. At the bottom of this Page select "Add mapping Template"
10. For content type please specify: "application/x-www-form-urlencoded"
11. Insert the template code below into the text field for the template. This code converts a URL Encoded form post into JSON for your Lambda function to parse
12. Deploy your API
13. In Slack, Go to Apps and Integrations
14. Click Build in the top right
15. Select Make a Custom Integration
16. Select Outgoing Webhooks
17. Pick trigger word "route" for the Bot!
18. In URL, put the URL created by your API Gateway Deployment

#### Template code for Integration Request:
```
## convert HTML POST data or HTTP GET query string to JSON
 
## get the raw post data from the AWS built-in variable and give it a nicer name
#if ($context.httpMethod == "POST")
 #set($rawAPIData = $input.path('$'))
#elseif ($context.httpMethod == "GET")
 #set($rawAPIData = $input.params().querystring)
 #set($rawAPIData = $rawAPIData.toString())
 #set($rawAPIDataLength = $rawAPIData.length() - 1)
 #set($rawAPIData = $rawAPIData.substring(1, $rawAPIDataLength))
 #set($rawAPIData = $rawAPIData.replace(", ", "&"))
#else
 #set($rawAPIData = "")
#end
 
## first we get the number of "&" in the string, this tells us if there is more than one key value pair
#set($countAmpersands = $rawAPIData.length() - $rawAPIData.replace("&", "").length())
 
## if there are no "&" at all then we have only one key value pair.
## we append an ampersand to the string so that we can tokenise it the same way as multiple kv pairs.
## the "empty" kv pair to the right of the ampersand will be ignored anyway.
#if ($countAmpersands == 0)
 #set($rawPostData = $rawAPIData + "&")
#end
 
## now we tokenise using the ampersand(s)
#set($tokenisedAmpersand = $rawAPIData.split("&"))
 
## we set up a variable to hold the valid key value pairs
#set($tokenisedEquals = [])
 
## now we set up a loop to find the valid key value pairs, which must contain only one "="
#foreach( $kvPair in $tokenisedAmpersand )
 #set($countEquals = $kvPair.length() - $kvPair.replace("=", "").length())
 #if ($countEquals == 1)
  #set($kvTokenised = $kvPair.split("="))
  #if ($kvTokenised[0].length() > 0)
   ## we found a valid key value pair. add it to the list.
   #set($devNull = $tokenisedEquals.add($kvPair))
  #end
 #end
#end
 
## next we set up our loop inside the output structure "{" and "}"
{
#foreach( $kvPair in $tokenisedEquals )
  ## finally we output the JSON for this pair and append a comma if this isn't the last pair
  #set($kvTokenised = $kvPair.split("="))
 "$util.urlDecode($kvTokenised[0])" : #if($kvTokenised[1].length() > 0)"$util.urlDecode($kvTokenised[1])"#{else}""#end#if( $foreach.hasNext ),#end
#end
}
```
