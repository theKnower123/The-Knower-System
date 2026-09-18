import { Link, Head } from "@inertiajs/react";
import { AlertTriangle, ServerCrash, ShieldAlert, FileQuestion, Ban, Clock, Activity, ArrowLeft, Home, RotateCcw, Mail, FileX, UploadCloud, FileWarning, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  status: number;
}

export default function ErrorPage({ status }: ErrorProps) {
  // Generate a random Error ID
  const errorId = `ERR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const errorContent: Record<number, { title: string; description: string; icon: React.ReactNode; color: string }> = {
    400: {
      title: "400 Bad Request",
      description: "The form is incomplete or the server cannot understand the request due to malformed syntax.",
      icon: <AlertTriangle className="h-24 w-24" />,
      color: "text-amber-500",
    },
    401: {
      title: "401 Unauthorized",
      description: "Authentication is required. You are not logged in.",
      icon: <ShieldAlert className="h-24 w-24" />,
      color: "text-rose-500",
    },
    402: {
      title: "402 Payment Required",
      description: "Your subscription has expired or payment is required.",
      icon: <AlertCircle className="h-24 w-24" />,
      color: "text-yellow-600",
    },
    403: {
      title: "403 Forbidden",
      description: "You lack the necessary authorization to access this page. (e.g. Developer trying to access Finance)",
      icon: <Ban className="h-24 w-24" />,
      color: "text-rose-600",
    },
    404: {
      title: "404 Not Found",
      description: "The page you are looking for is not found.",
      icon: <FileQuestion className="h-24 w-24" />,
      color: "text-blue-500",
    },
    405: {
      title: "405 Method Not Allowed",
      description: "The request method is not supported. For example, using GET instead of POST.",
      icon: <AlertTriangle className="h-24 w-24" />,
      color: "text-amber-600",
    },
    406: {
      title: "406 Not Acceptable",
      description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.",
      icon: <AlertCircle className="h-24 w-24" />,
      color: "text-orange-400",
    },
    408: {
      title: "408 Request Timeout",
      description: "The client waited too long. The server timed out waiting for the request.",
      icon: <Clock className="h-24 w-24" />,
      color: "text-orange-500",
    },
    409: {
      title: "409 Conflict",
      description: "There is a conflict with the current state of the resource. For example, Email already exists.",
      icon: <FileWarning className="h-24 w-24" />,
      color: "text-red-500",
    },
    410: {
      title: "410 Gone",
      description: "The page has been permanently deleted and is no longer available.",
      icon: <FileX className="h-24 w-24" />,
      color: "text-gray-500",
    },
    413: {
      title: "413 File Too Large",
      description: "The uploaded file exceeds the maximum allowed size limit.",
      icon: <UploadCloud className="h-24 w-24" />,
      color: "text-indigo-500",
    },
    415: {
      title: "415 Unsupported Media Type",
      description: "The uploaded file format is not supported.",
      icon: <FileWarning className="h-24 w-24" />,
      color: "text-purple-500",
    },
    422: {
      title: "422 Validation Error",
      description: "There was a validation error. Please check your input fields (e.g., Email Required, Password Short, Phone Invalid).",
      icon: <AlertTriangle className="h-24 w-24" />,
      color: "text-red-600",
    },
    429: {
      title: "429 Too Many Requests",
      description: "Rate limit exceeded. You have sent too many requests in a given amount of time.",
      icon: <Activity className="h-24 w-24" />,
      color: "text-yellow-500",
    },
    500: {
      title: "500 Internal Server Error",
      description: "An unexpected condition was encountered by the server.",
      icon: <ServerCrash className="h-24 w-24" />,
      color: "text-red-500",
    },
    501: {
      title: "501 Not Implemented",
      description: "The requested feature has not been implemented yet.",
      icon: <Zap className="h-24 w-24" />,
      color: "text-purple-600",
    },
    502: {
      title: "502 Bad Gateway",
      description: "The server received an invalid response from the upstream server.",
      icon: <ServerCrash className="h-24 w-24" />,
      color: "text-purple-500",
    },
    504: {
      title: "504 Gateway Timeout",
      description: "The other server is not responding in a timely manner.",
      icon: <Clock className="h-24 w-24" />,
      color: "text-indigo-600",
    },
  };

  if (status === 503) {
    return <MaintenancePage />;
  }

  const defaultError = {
    title: `${status} Unexpected Error`,
    description: "An unexpected error occurred. Please try again or contact support if the issue persists.",
    icon: <AlertTriangle className="h-24 w-24" />,
    color: "text-gray-500",
  };

  const content = errorContent[status] || defaultError;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Head title={content.title} />
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 blur-3xl opacity-20 ${content.color.replace('text-', 'bg-')}`}></div>
          <div className={`relative ${content.color} transform transition-transform hover:scale-110 duration-500`}>
            {content.icon}
          </div>
        </div>
        
        {/* Title */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {content.title}
        </h1>
        
        {/* Description */}
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
          {content.description}
        </p>
        
        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => window.location.reload()} size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all">
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="secondary" size="lg" className="gap-2">
            <a href="mailto:support@theknowersystem.com">
              <Mail className="h-4 w-4" />
              Contact Support
            </a>
          </Button>
        </div>

        {/* Error ID */}
        <div className="mt-16 border-t border-border/50 pt-8 w-full max-w-md mx-auto">
          <div className="rounded-lg bg-muted/50 p-4 border border-border">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="font-semibold text-foreground">Error ID:</span> 
              <span className="font-mono bg-background px-2 py-1 rounded border shadow-sm">{errorId}</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              Please provide this ID when contacting support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Head title="503 Service Unavailable - Maintenance" />
      <div className="max-w-3xl w-full text-center space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <ServerCrash className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">The Knower OS</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            We'll be right back.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our site is currently undergoing scheduled maintenance to upgrade our infrastructure and bring you new features.
          </p>
          
          {/* Status */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full font-medium text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            System Upgrading
          </div>
        </div>

        {/* Countdown & Estimated Time */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-muted rounded-2xl p-6 border border-border shadow-sm">
            <div className="text-4xl font-bold font-mono text-primary">02</div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">HOURS</div>
          </div>
          <div className="bg-muted rounded-2xl p-6 border border-border shadow-sm">
            <div className="text-4xl font-bold font-mono text-primary">45</div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">MINUTES</div>
          </div>
          <div className="bg-muted rounded-2xl p-6 border border-border shadow-sm">
            <div className="text-4xl font-bold font-mono text-primary">12</div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">SECONDS</div>
          </div>
          <div className="bg-muted rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-center">
            <div className="text-sm text-muted-foreground font-medium">ETA</div>
            <div className="text-lg font-bold text-foreground mt-1">14:00 GMT</div>
          </div>
        </div>

        {/* Subscribe */}
        <div className="max-w-md mx-auto space-y-4 pt-8">
          <h3 className="text-lg font-semibold text-foreground">Get notified when we're back</h3>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button>Notify Me</Button>
          </div>
        </div>

        {/* Contact & Social Media */}
        <div className="pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <a href="mailto:support@theknowersystem.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="h-4 w-4" /> Support
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Status Page</a>
          </div>
        </div>
      </div>
    </div>
  );
}

ErrorPage.layout = (page: React.ReactNode) => <>{page}</>;
