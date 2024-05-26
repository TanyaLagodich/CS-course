# ДЗ к лекции База#10

## Реализовать менеджер памяти на основе ArrayBuffer

```
// Задаем размер памяти в байтах, т.е. тут 100 килобайт.
// Максимальный размер стека 10 килобайт
const mem = new Memory(100 * 1024, {stack: 10 * 1024});

const pointer2 = mem.push(arrayBuffer1); // Добавляем значение в стек, метод должен вернуть указатель на первый байт данных
mem.push(arrayBuffer2); // Добавляем еще значение в стек

console.log(pointer.deref()); // Извлекаем значение по указателю, arrayBuffer1
pointer.change(arrayBuffer3); // Меняем значение данных по указателю

mem.pop(); // Освобождаем память arrayBuffer2
mem.pop(); // Освобождаем память arrayBuffer3

// Запрашиваем память заданного размера в байтах в куче
const pointer2 = mem.alloc(128); // Возвращается указатель на первый байт
pointer2.change(arrayBuffer4);   // Меняем значение данных по указателю

const pointer3 = mem.alloc(8);
const pointer4 = mem.alloc(4);
const pointer5 = mem.alloc(5 * 1024);

pointer2.free(); // Освобождаем занимаюмую память
pointer3.free();
pointer4.free();
pointer5.free();
```

## Доработать VM из ДЗ2*

Задача со звездочкой для тех, кому мало :)

1. Теперь программа должна представляться в виде Uint8Array.
2. В этом массиве должен быть код программы, а также стек и куча.
3. Для работы со стеком и кучей должны быть отдельные команды.
4. Регистровая память - это локальные переменные в функции execute.