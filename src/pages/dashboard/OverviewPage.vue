<template>
  <section>
    <PageHeader
      title="Dashboard Overview"
      subtitle="Summary of RFID operations, pending work, and recent activity."
      action-label="Refresh Data"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-lg font-semibold">Today Snapshot</h2>
            <Badge>Live</Badge>
          </div>
          <p class="text-sm text-muted-foreground">Key metrics from RFID operations.</p>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <Button>View Details</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-lg font-semibold">Recent Requests</h2>
            <Badge variant="secondary">3 Rows</Badge>
          </div>
          <p class="text-sm text-muted-foreground">Small demo table for dashboard list rendering.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>REQ-1012</TableCell>
                <TableCell><Badge>Open</Badge></TableCell>
                <TableCell>Warehouse A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>REQ-1013</TableCell>
                <TableCell><Badge variant="secondary">In Review</Badge></TableCell>
                <TableCell>Operations</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>REQ-1014</TableCell>
                <TableCell><Badge variant="outline">Closed</Badge></TableCell>
                <TableCell>Logistics</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import PageHeader from '../../components/common/PageHeader.vue'
import Badge from '../../components/ui/Badge.vue'
import Button from '../../components/ui/Button.vue'
import Card from '../../components/ui/Card.vue'
import CardContent from '../../components/ui/CardContent.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import Table from '../../components/ui/Table.vue'
import TableBody from '../../components/ui/TableBody.vue'
import TableCell from '../../components/ui/TableCell.vue'
import TableHead from '../../components/ui/TableHead.vue'
import TableHeader from '../../components/ui/TableHeader.vue'
import TableRow from '../../components/ui/TableRow.vue'
</script>
