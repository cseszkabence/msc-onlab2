import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountInfo, AccountService } from '../../../shared/services/account/account.service';
import { ConfigurationListItem, ConfiguratorService } from '../../../shared/services/configuration/configurator.service';
import { OrderSummary, OrderService } from '../../../shared/services/order/order.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { StripeAffirmMessageComponent } from 'ngx-stripe';
import { MessageModule } from 'primeng/message';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitterModule } from 'primeng/splitter';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ButtonModule, ListboxModule, ProgressSpinnerModule, MessageModule, FieldsetModule, SplitterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = true;
  error: string | null = null;

  me: AccountInfo | null = null;
  orders: OrderSummary[] = [];
  configs: ConfigurationListItem[] = [];

  constructor(
    private account: AccountService,
    private ordersSvc: OrderService,
    private configsSvc: ConfiguratorService
  ) { }

  ngOnInit(): void {
    // Fetch all three in parallel
    const me$ = this.account.getMe();
    const orders$ = this.ordersSvc.list();
    const configs$ = this.configsSvc.listMine();

    // Simple merge without Rx fuss: subscribe individually and flip loading when all resolve
    let pending = 3;
    const done = () => { if (--pending === 0) this.loading = false; };

    me$.subscribe({
      next: v => { this.me = v; done(); },
      error: err => { this.error = err?.message || 'Failed to load account.'; done(); }
    });

    orders$.subscribe({
      next: v => { this.orders = v || []; done(); },
      error: err => { this.error = err?.message || 'Failed to load orders.'; done(); }
    });

    configs$.subscribe({
      next: v => { this.configs = v || []; done(); },
      error: err => { this.error = err?.message || 'Failed to load configurations.'; done(); }
    });
  }

  trackOrderById = (_: number, o: OrderSummary) => o.orderId;
  trackConfigById = (_: number, c: ConfigurationListItem) => c.configurationId;

  statusToSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const s = (status || '').toLowerCase();
    if (['paid', 'completed', 'delivered'].includes(s)) return 'success';
    if (['processing', 'pending', 'in progress'].includes(s)) return 'warn';
    if (['cancelled', 'failed', 'refunded'].includes(s)) return 'danger';
    return 'info';
  }
}