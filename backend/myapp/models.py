from django.db import models
class Product(models.Model):
    CATEGORY_CHOICES = [
        ('coffee', 'กาแฟ'),
        ('chocolate', 'ช็อคโกแลต'),
        ('cocoa', 'โกโก้'),
        ('tea', 'ชา'),
        ('milk', 'นม'),
        ('bakery', 'ขนม'),
    ]
    TYPE_CHOICES = [
        ('blended', 'ปั่น'),
        ('iced', 'เย็น'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=5000, null=True, blank=True)  
    stock = models.PositiveIntegerField(default=0)  # จำนวนสินค้าคงเหลือ
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='blended') 
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ขาย {self.quantity}x {self.product.name} ({self.product.get_category_display()}) - {self.total_price} บาท"









