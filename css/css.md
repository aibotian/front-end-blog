## css中的小技

1. `vertical-align`

  ```
  <span>第一个</span>
  <span>第一个</span>
  <span>第一个</span>
  <style>
  span:nth-child(1) {
		  font-size: 12px;
		}
		span:nth-child(2) {
			font-size: 16px;
		}
		span:nth-child(3) {
			font-size: 24px;
		}
	</style>
```

> 默认这三个行内标签是按照基线，也就是文字最底部来对齐的
