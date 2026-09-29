# FreeMote驱动
这个目录放了FreeMote的驱动

## 调整内存用于测试

使用 Python 3，命令可以在任意目录执行；脚本默认修改自身旁边的 `FreeMoteDriver.js`。

```sh
# 查看当前堆和栈默认值
python driver/set-memory.py

# 设置总堆容量为 144 MiB，保持栈设置不变
python driver/set-memory.py --heap-mib 144

# 调整两项参数，或恢复之前的 256 MiB / 5 MiB 配置
python driver/set-memory.py --heap-mib 160 --stack-mib 5
python driver/set-memory.py --heap-mib 256 --stack-mib 5
```

这里采用 **MiB（1024×1024 字节）**。当前默认总堆容量为 **144 MiB（150994944 字节）**，栈为 **5 MiB**；栈包含在总缓冲区内。堆容量要求为 16 MiB 的整数倍，且至少为栈容量的两倍，避免驱动自动向上取整造成配置与实际容量不一致。

修改只影响驱动的默认值；页面提前设置的 `EmoteModule.TOTAL_MEMORY` / `TOTAL_STACK`（或 `Module` 配置）仍可覆盖它。修改后禁用缓存并刷新页面，已有页面的缓冲区不会随文件变化。

144 MiB 是最大现有模型已通过启动与初始绘制的最低测试档位，并非已证明的安全下限。最大模型测得分配水位约 136.35 MiB，只余约 7.65 MiB。纹理边长不超过 4096 不能单独保证容量足够，纹理数量、模型结构和动作分配也会影响需求。该驱动不能自动扩容；遇到内存不足请提高到 160、192 或 256 MiB。降低声明容量不保证实际驻留内存同比下降，详见 `../docs/model-memory-analysis.md`。

脚本通过唯一的配置声明定位修改，拒绝不匹配的驱动，校验后原子替换文件。可用 `--driver /path/to/FreeMoteDriver.js` 指定测试副本。
