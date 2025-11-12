import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: string[];
  sound: string;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '07:00',
      label: 'Утренний подъём',
      enabled: true,
      repeat: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      sound: 'Радар'
    },
    {
      id: '2',
      time: '08:30',
      label: 'Выход из дома',
      enabled: false,
      repeat: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      sound: 'Восход'
    },
    {
      id: '3',
      time: '22:00',
      label: 'Время спать',
      enabled: true,
      repeat: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      sound: 'Колыбельная'
    }
  ]);

  const [notifications] = useState([
    { id: '1', time: '5 мин назад', text: 'Будильник "Утренний подъём" сработал', icon: 'Bell' },
    { id: '2', time: '1 час назад', text: 'Будильник "Выход из дома" пропущен', icon: 'BellOff' },
    { id: '3', time: 'Вчера', text: 'Будильник "Время спать" остановлен', icon: 'Bell' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const filteredAlarms = alarms.filter(alarm =>
    alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alarm.time.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Будильник</h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Icon name="Bell" size={24} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>

        <Card className="p-8 mb-8 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-0">
          <div className="text-7xl font-light tracking-tight mb-2">
            {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-muted-foreground text-sm">
            {currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </Card>

        {showNotifications ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Уведомления</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                Закрыть
              </Button>
            </div>
            {notifications.map((notif) => (
              <Card key={notif.id} className="p-4 hover-scale cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={notif.icon as any} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{notif.text}</p>
                    <p className="text-xs text-muted-foreground">{notif.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск будильников"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-0 bg-secondary"
              />
            </div>

            <div className="space-y-3">
              {filteredAlarms.map((alarm) => (
                <Card 
                  key={alarm.id} 
                  className={`p-5 transition-all hover-scale ${alarm.enabled ? 'border-primary/20' : 'opacity-60'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-4xl font-light mb-1">{alarm.time}</div>
                      <div className="text-sm text-muted-foreground">{alarm.label}</div>
                    </div>
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                      className="scale-110"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      {alarm.repeat.map((day, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-0.5 font-normal">
                          {day}
                        </Badge>
                      ))}
                    </div>
                    <span className="mx-2">•</span>
                    <span>{alarm.sound}</span>
                  </div>
                </Card>
              ))}
            </div>

            {filteredAlarms.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Search" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Будильники не найдены</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-6 py-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-14 text-base gap-2" size="lg">
                <Icon name="Plus" size={20} />
                Добавить будильник
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый будильник</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Время</Label>
                  <Input type="time" defaultValue="09:00" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input placeholder="Название будильника" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Повтор</Label>
                  <div className="flex gap-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                      <Button key={day} variant="outline" size="sm" className="flex-1">
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="w-full h-12 mt-4">Сохранить</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Index;
