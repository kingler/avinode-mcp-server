Hey everyone, welcome to Nering.io. I'm
0:02
JD and today what we're going to go
0:04
through is a couple different examples
0:06
of how to do MCP HTTP streamable
0:10
connections. We're going to take a look
0:11
at a client node in React and then we're
0:13
also going to look at the back end of
0:15
how you can set up your own compatible
0:17
HTTP streamable events. With that, let's
0:20
go ahead and get started.
0:23
All right. So, MCP came out with SSE a
0:27
while back and then they even came out
0:28
with streamable HTTP.
0:31
And I've been digging into that, but I
0:33
also wanted to figure out uh this
0:36
example where it's talking about
0:37
backwards compatibility. And I found
0:39
that interesting because I already had
0:41
the SSE examples from before. So, what I
0:44
want to do is take that same uh repo and
0:47
actually update it so that I have the uh
0:52
MCP
0:54
slash, we still have our SSE and we
0:57
still have our messages. So, we've kind
1:00
of we know that there's other transports
1:02
that kind of adhere to all of this,
1:04
right? And so this is an example of how
1:07
we can take the deprecated SSE and go
1:11
with a more streamable HTTP endpoint
1:14
which allows us for stateless
1:16
applications and things like that which
1:18
is super helpful with like NAD. So what
1:21
we're going to do is we're going to take
1:22
a look at this code and basically what
1:26
we need to go into is our server.
1:31
So, as you can see right here, we still
1:33
have our SSE, our old uh transport
1:36
there, and we have the ability to pull
1:38
in messages, but now we want to expand
1:41
this so that we can still use these same
1:44
tools, but actually use our MCP
1:49
streamable. Really, all we need to do is
1:52
just add this app.all/MCP, all slashmcp
1:56
use our streamable uh handler and then
2:00
actually pass our server as well as our
2:04
uh request. So this HTTP uh handler that
2:08
I built is right here. So first we're
2:11
looking to see if it's a post. We want
2:12
to look for our MCP session ID. We're
2:15
actually going to then make sure that we
2:18
if we don't have a session ID, we're
2:20
going to random UU ID it. We're going to
2:23
make that into our session generator.
2:26
We're going to session initialize
2:29
and then we're going to actually uh pass
2:32
that information as a valid request. If
2:34
it's already got a session ID, then
2:36
we're going to actually use the
2:37
transport that it's already requested
2:39
and its operation for SS uh for the
2:42
session ID and then execute or handle
2:45
the request in that way. If not, we have
2:47
some error handling here. So based on
2:51
this, let's go ahead and take a look at
2:52
the inspector and let's see if we can
2:55
connect to it. So I already had it uh
2:57
connected. We're just going to go ahead
2:58
and do a new connection. We can look. So
3:01
these are the previous resources that we
3:03
had before. Previous resource templates
3:06
that we've had before,
3:08
our list of prompts,
3:11
our tools.
3:14
So add and search. and we haven't done
3:16
much with ping or sampling or roots. So,
3:19
we know that we have access to all our
3:21
tools and we're hitting our NCP endpoint
3:23
the same as we were hitting the SSC uh
3:26
endpoint before.
3:28
So, now let's take a look at what we're
3:30
going to do for the front end. So, what
3:33
we're going to do is this is our
3:34
previous example. You can see we still
3:36
have our tools. We can still connect to
3:39
MCP, but now I want to make an
3:41
interactive client. I actually did this
3:43
I've been doing this more often where
3:45
just kind of want to have like a way to
3:47
visualize what's actually happening on
3:49
the server and we can give it like
3:50
different implementations and things
3:52
like that. So we have our uh MCP we can
3:56
go ahead and connect to that. It's going
3:58
to let us know what our session is. We
4:00
can actually do a quick select of tools
4:03
and we can also see where we're have
4:05
some conflict errors. We can actually
4:07
see the session ID that we have
4:09
available here too. We also have what
4:11
tools are available.
4:14
So when we click list tools, the
4:16
undefined is the description, but we can
4:18
actually see we can actually take that
4:21
tool. If we wanted to do an add, we can
4:23
just do an add and we can actually see
4:26
that it's interfacing. So we're actually
4:27
adding some uh custom custom abilities.
4:32
We have our ability to look at prompts.
4:35
Can actually see this being different
4:37
kind of coded. And then we can actually
4:39
do help for a little bit of what is
4:43
actually going on with all these things
4:45
in order to have more of an interactive
4:47
service.
4:49
Again, if we wanted to
4:53
select a tool and go ahead and send
4:56
another invocation, we can go ahead and
4:59
connect. And it's going ahead and
5:00
calling the tool for adding.
5:05
So let's take a look at how I actually
5:07
built the uh the interactive client. So
5:11
basically we still have our interactive
5:13
clients. We're connecting to our MCP
5:17
base URL. So this is our backend.
5:19
Probably do that with like a bite
5:21
environment variable.
5:24
But then what we're doing is we're
5:26
actually using a lot of different uh
5:29
basically like is there an error or
5:32
starts with and in order to do color
5:35
coding and actually kind of build
5:36
ourselves our own little console so that
5:39
we can actually debug and interact with
5:41
MCP.
5:44
Again, here's our client. We're
5:47
initializing based on our session ID. So
5:50
if we have that session ID, we can
5:51
actually interact with the client
5:53
otherwise create a new new client. Then
5:56
we're actually fetching information
5:59
pulling back what our session is. Here's
6:02
our uh new transport URL. We have our on
6:05
close as well as our on error. We even
6:08
have notification handlers.
6:11
Um and then finally we have our connect
6:13
to our transport.
6:15
The rest of this is essentially adding
6:17
like logging and state and things like
6:19
that so we can actually see what's going
6:21
on. Again, we have the ability to list
6:23
out our tools very similar to what we
6:25
were doing with uh Brave search. And
6:28
there's also one for um for prompts and
6:32
we can have the ability to disconnect.
6:35
So, we're adding in a lot of
6:36
functionality on the front end again
6:38
just to make like an interactive client
6:40
of how we can actually interface with
6:41
this tool.
6:44
The next thing that we're going to do is
6:47
uh actually go look at this in NAND.
6:50
And before we do that, I just want to
6:52
give a shout out to the community. You
6:54
know, uh there's only so much I can put
6:57
into N8 MCP. And so when you contribute,
7:02
I truly appreciate it. And uh this the
7:04
HTTP streamable being put into NAN was
7:07
actually by a contributor. So again,
7:10
huge thanks to the uh community. Uh, I
7:13
know there's more bugs. If more people
7:14
can help and contribute, it'll be super
7:17
helpful.
7:18
All right. So, now if we go into the MCP
7:23
uh in NAN, there's two ways to do this.
7:26
So, understand that in this example, I'm
7:29
using the N8N MCP client community node,
7:35
not to be confused with the N8N
7:39
uh native MCP client. There's also a way
7:43
to do that. They they use SSE as a way
7:46
to to hit that particular endpoint. So
7:51
in this example, if we want to create an
7:54
HTTP streamable account for the
7:57
community node, you go ahead and you
7:59
click create and then you can just do
8:02
MCP. And as you can see, we now have the
8:04
HTTP streamable API. In this case, I'm
8:07
just going to point it to the streamable
8:09
URL of MCP. Uh, again, as before, you
8:13
can change um, you know, message post,
8:16
which you don't necessarily need, as
8:18
well as our additional headers.
8:22
All right. So, now what we're going to
8:23
do is we're going to take a look at just
8:24
a basic example. So, we have an MCP
8:27
standalone, which basically has the HTTP
8:30
removal account. We're just going to go
8:32
ahead and list our tools so we can
8:34
actually see what the schema is that it
8:36
returns. So we know we have our ad. We
8:38
know we have our search. And then what
8:40
we're going to do is we can actually
8:43
look at this agent. So again, you could
8:45
connect this to a chat. What I'm doing
8:47
is I'm just hard coding it saying
8:49
searching for MCP.
8:51
And then what we're going to do is we're
8:52
going to list our tools same as before.
8:54
And we're just going to execute
8:55
dynamically. So you can see that we're
8:58
using a streamable. You'll see that
9:00
we're using streamable. I am doing the
9:02
tool name, but we're autopassing the
9:05
tools to override and basically look at
9:09
what its uh parameters are. You can also
9:11
define the uh don't have to define the
9:14
tool. So now if we go ahead and run
9:16
this, it's listing as well as trying to
9:22
uh search. And so as part of the search,
9:25
you can actually see that it was
9:26
executed and that we got search
9:29
information back.
9:33
All right, that's it for us today
9:34
everyone. So what we went through is a
9:36
combination of how you can actually use
9:38
HTTP streamable events in both the
9:43
front-end client as well as setting up
9:46
the backend server. We also took a look
9:48
at how you can actually connect these in
9:50
any with that. Happy nerding.

