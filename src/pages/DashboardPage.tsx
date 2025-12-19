import { useAuth } from '@/contexts/AuthContext';
import { mockSprints, mockTickets, getDeveloperTickets, getResolvedTickets } from '@/data/mockData';
import { StatCard } from '@/components/stats/StatCard';
import { TicketCard } from '@/components/tickets/TicketCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Ticket, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const activeSprint = mockSprints.find(s => s.status === 'ACTIVE');
  const myTickets = user ? getDeveloperTickets(user.id === '3' ? '3' : '4') : [];
  const resolvedTickets = getResolvedTickets();
  const openTickets = mockTickets.filter(t => t.status === 'OPEN');
  const inProgressTickets = mockTickets.filter(t => t.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here's what's happening in your projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Sprint"
          value={activeSprint?.name.split(' - ')[0] || 'None'}
          icon={<Rocket className="h-5 w-5" />}
          description={activeSprint ? `${activeSprint.ticketCount} tickets` : undefined}
        />
        <StatCard
          label="Open Tickets"
          value={openTickets.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Awaiting assignment"
        />
        <StatCard
          label="In Progress"
          value={inProgressTickets.length}
          icon={<Clock className="h-5 w-5" />}
          description="Being worked on"
        />
        <StatCard
          label="Resolved"
          value={resolvedTickets.length}
          icon={<CheckCircle className="h-5 w-5" />}
          description="Pending verification"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sprint Card */}
        {activeSprint && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Active Sprint</CardTitle>
              <Badge variant="secondary" className="bg-chart-5/10 text-chart-5">
                {activeSprint.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">{activeSprint.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{activeSprint.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {activeSprint.startDate} → {activeSprint.endDate}
                </span>
                <Link to={`/sprints/${activeSprint.id}`}>
                  <Button variant="outline" size="sm">View Board</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role-specific content */}
        {user?.role === 'DEVELOPER' && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">My Assigned Tickets</CardTitle>
              <Link to="/my-tickets">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {myTickets.length > 0 ? (
                myTickets.slice(0, 3).map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} compact />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No tickets assigned to you
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {user?.role === 'TESTER' && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Verification Queue</CardTitle>
              <Link to="/verify">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {resolvedTickets.length > 0 ? (
                resolvedTickets.slice(0, 3).map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} compact />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No tickets to verify
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {user?.role === 'MANAGER' && (
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 border border-border">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Sprints</span>
                  </div>
                  <span className="font-semibold">{mockSprints.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 border border-border">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Tickets</span>
                  </div>
                  <span className="font-semibold">{mockTickets.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Tickets */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTickets.slice(0, 6).map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
