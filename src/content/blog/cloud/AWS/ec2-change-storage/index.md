---
title: EC2 스토리지 용량 변경하기
description: '’No space left ...’ 에러가 발생했을 때 스토리지 용량을 수정하는 방법이다. 그 전에 먼저 스토리지가 모두 사용중인 게 맞는지 확인이 필요하다. 100% 사용중으로 나와서 스토리지 용량 변경을 진행했다. 변경 방법 1. 콘솔에서 연결된 EBS 스토리지 용량을 수정한다. 2. 인스턴스에서 를 설치한다. 3.…'
pubDate: 2024-10-14 16:35:39
category: cloud
tags:
  - EC2





---


'No space left ...' 에러가 발생했을 때 스토리지 용량을 수정하는 방법이다. 그 전에 먼저 스토리지가 모두 사용중인 게 맞는지 확인이 필요하다.

```
ubuntu@[ip]: ~$ df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root        6.8G  6.7G     0 100% /
tmpfs            922M     0  922M   0% /dev/shm
tmpfs            369M   34M  336M  10% /run
tmpfs            5.0M     0  5.0M   0% /run/lock
efivarfs         128K  3.3K  125K   3% /sys/firmware/efi/efivars
/dev/nvme0n1p16  891M  129M  700M  16% /boot
/dev/nvme0n1p15   98M  6.4M   92M   7% /boot/efi
tmpfs            185M   12K  185M   1% /run/user/1000

```

100% 사용중으로 나와서 스토리지 용량 변경을 진행했다.

## 변경 방법

1. 콘솔에서 연결된 EBS 스토리지 용량을 수정한다.
2. 인스턴스에서 `cloud-guest-utils`를 설치한다.

    ```
    $ sudo apt update
    $ sudo apt install cloud-guest-utils
    ```
   3. `lsblk` 명령어로 파티션명을 확인한다.
       ```
      $ lsblk
      ```
   
       ```
      ubuntu@[ip]:~$ lsblk
       NAME         MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
       loop0          7:0    0 21.8M  1 loop /snap/amazon-ssm-agent/7984
       loop1          7:1    0 21.9M  1 loop /snap/amazon-ssm-agent/7994
       loop2          7:2    0 49.1M  1 loop /snap/core18/2826
       loop3          7:3    0 48.8M  1 loop /snap/core18/2848
       loop4          7:4    0 33.7M  1 loop /snap/snapd/21467
       loop5          7:5    0 33.7M  1 loop /snap/snapd/21761
       [파티션명]      259:0    0   10G  0 disk
       ├─nvme0n1p1  259:1    0    9G  0 part /
       ├─nvme0n1p15 259:2    0   99M  0 part /boot/efi
       └─nvme0n1p16 259:3    0  923M  0 part /boot
      ```
3. root partition 사이즈를 재설정 한다.
    ```
    $ sudo growpart /dev/[파티션명] 1
   ```
   
4. filesystem 사이즈를 재설정 한다.
    ```
   $ sudo resize2fs /dev/nvme0n1p1
   ```
   난 `df -h` 실행시 `/dev/root`의 사용량이 100% 였기 때문에 파티션명 아래에 `/` 경로를 사용하는 파일 시스템 이름을 넣어서 실행하면 된다.

5. 변경사항이 잘 적용됐는지 확인한다.
    ```
   $ df -h
   $ lsblk
   ```
