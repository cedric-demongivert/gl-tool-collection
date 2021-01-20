
def test (offset, size, depth = 0):
    padding = '  ' * depth

    if size < 1:
        return padding + 'ERROR'
    elif size == 1:
        return padding + 'cell * 32 + ' + str(offset)
    else:
        mid = size >> 1
        mask = (0xffffffff >> (32 - offset - mid))
        print('offset {0} size {1} mask {2} {2:b} {3}'.format(offset, size, mask, hex(mask)))

        if size == 2:
            result = padding + 'return countBits(bits & ' + hex(mask) + ') < rest ? '
            result += test(offset + mid, size - mid, 0)
            result += ' : '
            result += test(offset, size - mid, 0)
            return result
        else:
            result = padding + 'if (countBits(bits & ' + hex(mask) + ') < rest) {\r\n'
            result += test(offset + mid, size - mid, depth + 1) + '\r\n'
            result += padding + '} else {\r\n'
            result += test(offset, size - mid, depth + 1) + '\r\n'
            result += padding + '}'
            return result


print(test(0, 32))
