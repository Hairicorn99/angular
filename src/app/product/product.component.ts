import { PagedResultDto } from '@abp/ng.core';
import { ProductCategoriesService, ProductCategoryInListDto } from '@proxy/product-categories';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {ProductDto, ProductInListDto, ProductsService } from '@proxy/products';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationService } from '../shared/services/notification.service';
import { ProductDetailComponent } from './product-detail.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private ngUnsubscrible = new Subject<void>();
  blockedPanel: boolean = false;
  items: ProductInListDto[] = [];

    //Paging variables
    public skipCount: number = 0;
    public maxResultCount: number = 10;
    public totalCount: number;

    //Filter
    productCategories: any[] = [];
    keyword: string = '';
    categoryId: string = '';
  


  constructor(private productService: ProductsService, 
    private productCategoriesService:  ProductCategoriesService,
    private dialogService: DialogService,
    private notificationService: NotificationService) {}
  ngOnDestroy(): void {
    this.ngUnsubscrible.next();
    this.ngUnsubscrible.complete();
  }

  ngOnInit(): void {
      this.loadData();
      this.loadProductCategories();
  }
  loadData() {
    this.toggleBlockUI(true);
    this.productService
      .getListFilter({
        keyword: this.keyword,
        categoryId: this.categoryId,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscrible))
      .subscribe({
        next: (response: PagedResultDto<ProductInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
      
    }
    loadProductCategories(){
      this.productCategoriesService.getListAll()
      .subscribe((response: ProductCategoryInListDto[])=>{
        response.forEach(element=>{
          this.productCategories.push({
            value: element.id,
            name: element.name
          })
        });
      });
    }
  

 
  pageChanged(event: any): void {
    this.skipCount = (event.page -1) * this.maxResultCount;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(ProductDetailComponent, {
      header: 'Thêm mới sản phẩm',
      width: '70%',
    });

    ref.onClose.subscribe((data: ProductDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess("Thêm sản phẩm thành công");
      }
    });
  }

  private toggleBlockUI(enabled: boolean){
    if(enabled == true){
      this.blockedPanel = true;
    }else{
      setTimeout(()=>{
        this.blockedPanel = false;
      },1000);
    }
  }
}
