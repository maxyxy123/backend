import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ShippingModule } from './shipping/shipping.module';
import { PrismaService } from 'prisma/prisma.service';
import { RolesGuard } from './role/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/auth.guard';
@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
