Segmentation fault (core dumped)

```c++
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = malloc(sizeof(int) * 10);
    ptr[10] = 42; // Danger Zone!

    printf("%d\n", ptr[10]);
    free(ptr);
    return 0;
}
```

```javascript
function debugLife() {
    return "Code, Learn, Repeat.";
}

console.log(debugLife());

```

Code, Learn, Repeat.
